import { Injectable } from '@nestjs/common';

import { GenericObj, IUserInfo, INameSpace } from 'src/common/interfaces';

@Injectable()
export class AuctionsInfo {
  private auction: GenericObj<INameSpace>;

  isNameSpaceEmpty(nsp: string): boolean {
    return !(nsp in this.auction);
  }

  initAuction() {
    this.auction = {};
  }

  initNameSpace(nsp: string): void {
    if (this.isNameSpaceEmpty(nsp)) {
      this.auction[nsp] = {
        leftTime: 10,
        userData: {},
      };
    }
  }

  addUser(nsp: string, userInfo: IUserInfo, socketId: string): INameSpace {
    this.auction[nsp].userData = {
      ...this.auction[nsp].userData,
      [socketId]: {
        ...userInfo,
      },
    };
    return this.auction[nsp];
  }

  getUser(socketId: string, nsp: string) {
    return this.auction[nsp].userData[socketId];
  }

  deleteUser(nsp: string, socketId: string): IUserInfo {
    const deleteUserInfo = this.auction[nsp].userData[socketId];
    delete this.auction[nsp].userData[socketId];

    return deleteUserInfo;
  }

  getUserList(nsp: string): string[] {
    const userList = Object.keys(this.auction[nsp].userData).map(
      (socketId) => this.auction[nsp].userData[socketId].userId,
    );

    return userList;
  }

  // startTime(nsp: string) {}
}
