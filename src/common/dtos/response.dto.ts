import { GenericObj } from '../interfaces';

/**
 * @module ResponseDto
 */

export class ResponseDto<T> {
  /**
   * @param  {string} message successive message
   * @param  {IData} returnData return data with message
   */
  constructor(message: string, returnData?: GenericObj<T>) {
    this.data = { message, ...returnData };
  }

  data: {
    [key: string]: string | T;
  };
}
