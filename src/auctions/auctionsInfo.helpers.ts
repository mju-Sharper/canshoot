import { Injectable } from '@nestjs/common';

import { Namespace } from 'socket.io';
import { GenericObj, IUserInfo, INameSpace } from 'src/common/interfaces';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuctionsInfo {
  constructor(private loggerService: LoggerService) {}

  private auction: GenericObj<INameSpace>;

  isNameSpaceEmpty(nspName: string): boolean {
    return !(nspName in Object.keys(this.auction));
  }

  initAuction() {
    this.auction = {};
  }

  initNameSpace(nspName: string): void {
    if (this.isNameSpaceEmpty(nspName)) {
      this.auction[nspName] = {
        leftTime: 10,
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

  startTime(nspName: string, nsp: Namespace) {
    this.auction[nspName].leftTime = 10;
    this.loggerService.log(`"${nspName}"방 경매가 시작되었습니다.`);
    const timer = setInterval(() => {
      if (this.auction[nspName].leftTime === 0) {
        clearInterval(timer);
        nsp.emit('alert', '경매가 종료되었습니다.');
        this.loggerService.log(`"${nspName}"방 경매가 종료되었습니다.`);
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
    this.auction[nspName].leftTime = 10;
  }

  isBid(nspName: string) {
    return this.auction[nspName].leftTime === 0;
  }
}
