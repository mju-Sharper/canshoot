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
@WebSocketGateway({ namespace: /\/+/ })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private readonly connectedUsers = {};

  @WebSocketServer() public server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, payload: string) {
    const userInfo = this.connectedUsers[socket.nsp.name][socket.id];
    this.server.emit('message', {
      message: payload,
      userInfo,
    });
  }

  // afterInit() {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const productId = socket.nsp.name.replace('/', '');

    const payload = await this.jwtService.verify(
      socket.handshake.headers.authorization?.split(' ')[1],
      { secret: process.env.JWT_ACCESSTOKEN_SECRET },
    );
    const user = await this.userRepository.findUserById(payload.userId);
    const isAdmin = await this.userRepository.isAdmin(productId, user.id);

    const { userId } = user;
    const nameSpace = socket.nsp.name;
    if (!this.connectedUsers[nameSpace]) {
      this.connectedUsers[nameSpace] = {};
    }
    this.connectedUsers[nameSpace][socket.id] = { userId, isAdmin };

    this.server.emit('alert', `${userId}님이 입장하셨습니다.`);
    this.server.emit('userList', {
      connectedUsers: Object.values(this.connectedUsers[socket.nsp.name]),
    });
  }
  // 연결 됐을 때

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const { nsp: nameSpace } = socket;
    const deleteUser = this.connectedUsers[socket.nsp.name][socket.id];
    delete this.connectedUsers[socket.nsp.name][socket.id];
    nameSpace.emit('userList', {
      connectedUsers: Object.values(this.connectedUsers[socket.nsp.name]),
    });
    this.server.emit('alert', `${deleteUser}님이 퇴장하셨습니다.`);
  }
  // 끊어졌을 때
}
