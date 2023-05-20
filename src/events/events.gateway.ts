import { UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AuctionRepository } from 'src/auctions/auctions.repository';
import { AuctionsInfo } from 'src/auctions/auctionsInfo.helpers';
import { UserRepository } from 'src/auth/user.repository';
import { WebsocketExceptionsFilter } from 'src/common/filters';
import { LoggerService } from 'src/logger/logger.service';
import { getTime } from 'src/util';

import { EventsService } from './events.service';

// room형식은 /ws-${productId}
@WebSocketGateway({ namespace: /\/+/, cors: true })
@UseFilters(WebsocketExceptionsFilter)
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private loggerService: LoggerService,
    private auctionRepository: AuctionRepository,
    private auctionInfo: AuctionsInfo,
    private eventsService: EventsService,
  ) {}

  @WebSocketServer() public server: Server;

  afterInit() {
    this.loggerService.log('소켓이 시작됐습니다!');
    this.auctionInfo.initAuction();
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    this.loggerService.log('유저가 참여했습니다.');

    const { nsp, nspName, socketId, productId } =
      this.eventsService.parseSocketInfo(socket);

    this.auctionInfo.initNameSpace(nspName);
    const payload = await this.jwtService.verify(
      socket.handshake.headers.authorization?.split(' ')[1],
      { secret: process.env.JWT_ACCESSTOKEN_SECRET },
    );
    const user = await this.userRepository.findUserById(payload.userId);

    const { userId } = user;

    const isAdmin = await this.userRepository.isAdmin(productId, user.id);

    const enterTime = getTime();

    this.loggerService.log(`유저 등록
    이름 : ${userId} 관리자 : ${isAdmin} 시간 : ${enterTime}`);

    this.auctionInfo.addUser(
      nspName,
      {
        userId,
        isAdmin,
        enterTime,
      },
      socketId,
    );

    const connectedUsers = this.auctionInfo.getUserList(nspName);

    nsp.emit('alert', `${userId}님이 입장하셨습니다.`);
    nsp.emit('userList', {
      connectedUsers,
    });
  }
  // 연결 됐을 때

  /*   @SubscribeMessage('time')
  startTime() {
    if (!this.auctionTime) {
      this.server.emit('alert', `경매가 종료되었습니다!`);
      this.timer && clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.server.emit('time', {
        leftTime: this.auctionTime,
      });
      this.auctionTime -= 1;
    }, 1000); 
  } */

  @SubscribeMessage('chat')
  handleMessage(socket: Socket, payload: string) {
    const { nsp, nspName, socketId } =
      this.eventsService.parseSocketInfo(socket);
    const userInfo = this.auctionInfo.getUser(socketId, nspName);
    const sendTime = getTime();
    nsp.emit('chat', {
      message: payload,
      userInfo,
      sendTime,
    });
  }

  @SubscribeMessage('bid')
  async handleBid(socket: Socket, payload) {
    const { nsp, nspName, socketId, productId } =
      this.eventsService.parseSocketInfo(socket);
    const { bid } = payload;
    const userInfo = this.auctionInfo.getUser(socketId, nspName);
    const sendTime = getTime();

    this.loggerService.log(
      `입찰가 : ${bid}, 유저 : ${userInfo.userId}, 상품 : ${productId}`,
    );

    const updatedAuction = await this.auctionRepository.updateBid(
      bid,
      userInfo.userId,
      productId,
    );

    nsp.emit('bid', {
      updatedAuction,
      userInfo,
      sendTime,
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const { nsp, nspName } = this.eventsService.parseSocketInfo(socket);

    const { userId } = this.auctionInfo.deleteUser(socket.nsp.name, socket.id);

    const connectedUsers = this.auctionInfo.getUserList(nspName);

    nsp.emit('userList', {
      connectedUsers,
    });
    nsp.emit('alert', `${userId}님이 퇴장하셨습니다.`);

    this.loggerService.log(`${userId}님 퇴장`);
  }
  // 끊어졌을 때
}
