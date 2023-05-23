import { Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

@Injectable()
export class EventsService {
  parseSocketInfo(socket: Socket) {
    const nspName = socket.nsp.name;
    const productId = nspName.replace('/', '');
    return {
      productId,
      nsp: socket.nsp,
      nspName,
      socketId: socket.id,
    };
  }
}
