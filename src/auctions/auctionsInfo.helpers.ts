import { Injectable } from '@nestjs/common';

import { Namespace } from 'socket.io';
import { UserRepository } from 'src/auth/user.repository';
import { GenericObj, IUserInfo, INameSpace } from 'src/common/interfaces';
import { LoggerService } from 'src/logger/logger.service';

import { AuctionRepository } from './auctions.repository';

@Injectable()
export class AuctionsInfo {
  constructor(
    private loggerService: LoggerService,
    private auctionRepository: AuctionRepository,
    private userRepository: UserRepository,
  ) {}

  private auction: GenericObj<INameSpace>;

  isNameSpaceEmpty(nspName: string): boolean {
    return !(nspName in this.auction);
  }

  initAuction() {
    this.auction = {};
  }

  initNameSpace(nspName: string): void {
    if (this.isNameSpaceEmpty(nspName)) {
      this.auction[nspName] = {
        leftTime: 60,
        userData: {},
      };
    }
  }

  addUser(nspName: string, userInfo: IUserInfo, socketId: string): INameSpace {
    this.auction[nspName].userData = {
      ...this.auction[nspName].userData,
      [socketId]: {
        ...userInfo,
      },
    };
    return this.auction[nspName];
  }

  getUser(socketId: string, nspName: string) {
    return this.auction[nspName].userData[socketId];
  }

  deleteUser(nspName: string, socketId: string): IUserInfo {
    this.loggerService.log(`nspName : ${nspName}, socketId : ${socketId}`);

    const deleteUserInfo = this.auction[nspName].userData[socketId];
    delete this.auction[nspName].userData[socketId];

    return deleteUserInfo;
  }

  getUserList(nspName: string): IUserInfo[] {
    const userList = Object.keys(this.auction[nspName].userData).map(
      (socketId) => this.auction[nspName].userData[socketId],
    );

    return userList;
  }

  startTime(nspName: string, nsp: Namespace, productId: string) {
    this.auction[nspName].leftTime = 60;
    this.loggerService.log(`"${nspName}"방 경매가 시작되었습니다.`);
    const timer = setInterval(async () => {
      if (this.auction[nspName].leftTime === 0) {
        clearInterval(timer);
        nsp.emit('alert', '경매가 종료되었습니다.');

        const { bid, bidderId } =
          await this.auctionRepository.getAuctionByProductId(productId);

        const { userId } = await this.userRepository.findUser(bidderId);
        nsp.emit('result', `${userId}님 ${bid}원 낙찰`);

        this.loggerService.log(
          `"${nspName}"방 경매가 종료되었습니다. 낙찰 가격은 ${bid}, 낙찰된 사람은 ${userId}입니다.`,
        );
      } else {
        nsp.emit('time', {
          leftTime: this.auction[nspName].leftTime,
        });
        this.auction[nspName].leftTime -= 1;
      }
    }, 1000);
  }

  stopTime(nspName: string) {
    this.auction[nspName].leftTime = 0;
  }

  resetTime(nspName: string) {
    this.auction[nspName].leftTime = 60;
  }

  isBid(nspName: string) {
    return this.auction[nspName].leftTime === 0;
  }
}
