import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { UserRepository } from 'src/auth/user.repository';

// room형식은 /ws-${productId}
@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private readonly connectedUsers = {};

  @WebSocketServer() public server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, payload: string) {
    const user = this.connectedUsers[socket.nsp.name][socket.id];
    this.server.emit('message', {
      message: payload,
      user,
    });
  }

  // afterInit() {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const payload = this.jwtService.verify(
      socket.handshake.headers.authorization?.split(' ')[1],
      { secret: process.env.JWT_ACCESSTOKEN_SECRET },
    );
    const user = await this.userRepository.findUserById(payload.userId);

    const { userId } = user;
    const nameSpace = socket.nsp.name;
    if (!this.connectedUsers[nameSpace]) {
      this.connectedUsers[nameSpace] = {};
    }
    this.connectedUsers[nameSpace][socket.id] = userId;

    this.server.emit('message', `${userId}님이 입장하셨습니다.`);
    this.server.emit('connected', {
      connectedUsers: Object.values(this.connectedUsers[socket.nsp.name]),
    });
  }
  // 연결 됐을 때

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const { nsp: nameSpace } = socket;
    const deleteUser = this.connectedUsers[socket.nsp.name][socket.id];
    delete this.connectedUsers[socket.nsp.name][socket.id];
    nameSpace.emit('onlineList', {
      connectedUsers: Object.values(this.connectedUsers[socket.nsp.name]),
    });
    this.server.emit('message', `${deleteUser}님이 퇴장하셨습니다.`);
  }
  // 끊어졌을 때
}
