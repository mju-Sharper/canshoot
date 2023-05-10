import { UseFilters } from '@nestjs/common';
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
import { AuctionRepository } from 'src/auctions/auctions.repository';
import { UserRepository } from 'src/auth/user.repository';
import { WebsocketExceptionsFilter } from 'src/common/filters';
import { LoggerService } from 'src/logger/logger.service';
import { getTime } from 'src/util';

// room형식은 /ws-${productId}
@WebSocketGateway({ namespace: /\/+/, cors: true })
@UseFilters(WebsocketExceptionsFilter)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private loggerService: LoggerService,
    private auctionRepository: AuctionRepository,
  ) {}

  @WebSocketServer() public server: Server;

  public productId: string;

  private readonly connectedUsers = {};

  async handleConnection(@ConnectedSocket() socket: Socket) {
    this.loggerService.log('유저가 참여했습니다.');
    this.productId = socket.nsp.name.replace('/', '');

    const payload = await this.jwtService.verify(
      socket.handshake.headers.authorization?.split(' ')[1],
      { secret: process.env.JWT_ACCESSTOKEN_SECRET },
    );
    const user = await this.userRepository.findUserById(payload.userId);
    const isAdmin = await this.userRepository.isAdmin(this.productId, user.id);

    const { userId } = user;
    if (!this.connectedUsers[this.productId]) {
      this.connectedUsers[this.productId] = {};
    }

    const enterTime = getTime();
    this.connectedUsers[this.productId][socket.id] = {
      userId,
      isAdmin,
      enterTime,
    };

    this.server.emit('alert', `${userId}님이 입장하셨습니다.`);
    this.server.emit('userList', {
      connectedUsers: Object.values(this.connectedUsers[this.productId]),
    });
  }
  // 연결 됐을 때

  @SubscribeMessage('message')
  handleMessage(socket: Socket, payload: string) {
    const userInfo = this.connectedUsers[this.productId][socket.id];
    const sendTime = getTime();
    this.server.emit('message', {
      message: payload,
      userInfo,
      sendTime,
    });
  }

  @SubscribeMessage('bid')
  async handleBid(socket: Socket, payload) {
    const { bid } = payload;
    const userInfo = this.connectedUsers[this.productId][socket.id];
    const sendTime = getTime();

    this.loggerService.log(
      `입찰가 : ${bid}, 유저 : ${userInfo.userId}, 상품 : ${this.productId}`,
    );

    const updatedAuction = await this.auctionRepository.handleBid(
      bid,
      userInfo.userId,
      this.productId,
    );

    this.server.emit('bid', {
      updatedAuction,
      userInfo,
      sendTime,
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const { nsp: nameSpace } = socket;
    const deleteUser = this.connectedUsers[this.productId][socket.id];
    delete this.connectedUsers[this.productId][socket.id];
    nameSpace.emit('userList', {
      connectedUsers: Object.values(this.connectedUsers[this.productId]),
    });
    this.server.emit('alert', `${deleteUser}님이 퇴장하셨습니다.`);
  }
  // 끊어졌을 때
}
