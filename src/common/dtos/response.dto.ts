interface IData {
  [key: string]: string;
}

/**
 * @module ResponseDto
 */

export class ResponseDto {
  /**
   * @param  {string} message successive message
   * @param  {IData} returnData return data with message
   */
  constructor(message: string, returnData?: IData) {
    this.data = { message, ...returnData };
  }

  data: {
    message: string;
    [key: string]: string;
  };
}
