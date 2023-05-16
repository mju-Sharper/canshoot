import { GenericObj } from './GenericObj.interface';

export interface IUserInfo {
  userId: string;
  isAdmin: boolean;
  enterTime: string;
}

export interface INameSpace {
  time: number;
  userData: GenericObj<IUserInfo>;
}
