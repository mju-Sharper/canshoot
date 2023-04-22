import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { ServerOptions } from 'socket.io';

export class AuthenticatedSocketIoAdapter extends IoAdapter {
  private readonly jwtService: JwtService;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.jwtService = this.app.get(JwtService);
  }

  createIOServer(port: number, options: ServerOptions): any {
    options.allowRequest = async (request, allowFunction) => {
      const token = request.headers.authorization?.split(' ')[1];
      const verified =
        token &&
        (await this.jwtService.verify(token, {
          secret: process.env.JWT_ACCESSTOKEN_SECRET,
        }));
      if (verified) {
        return allowFunction(null, true);
      }
      allowFunction('UNAUTHORIZED', false);
    };

    return super.createIOServer(port, options);
  }
}
