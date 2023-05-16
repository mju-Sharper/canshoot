import { Injectable } from '@nestjs/common';

import { GenericObj, IUserInfo, INameSpace } from 'src/common/interfaces';

@Injectable()
export class AuctionsInfo {
  private auction: GenericObj<INameSpace>;

  isNameSpaceEmpty(nsp: string): boolean {
    return nsp in this.auction;
  }

  initNameSpace(nsp: string): INameSpace {
    this.auction[nsp] = {
      time: 10,
      userData: {},
    };
    return this.auction[nsp];
  }

  addUser(nsp: string, userInfo: IUserInfo, socketId: string): INameSpace {
    this.auction[nsp].userData = {
      ...this.auction[nsp].userData,
      [socketId]: userInfo,
    };
    return this.auction[nsp];
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
}
