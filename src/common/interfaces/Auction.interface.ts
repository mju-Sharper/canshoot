import { GenericObj } from './GenericObj.interface';

export interface IUserInfo {
  userId: string;
  isAdmin: boolean;
  enterTime: string;
}

export interface INameSpace {
  timer?: NodeJS.Timer;
  leftTime: number;
  userData: GenericObj<IUserInfo>;
}
