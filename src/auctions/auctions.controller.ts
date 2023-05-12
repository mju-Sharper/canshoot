import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ResponseDto } from 'src/common/dtos';

import { AuctionsService } from './auctions.service';

@Controller('auctions')
@UseGuards(AuthGuard())
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Get('/bid/:id')
  async getBid(@Param('id') productId: string): Promise<ResponseDto<number>> {
    return this.auctionsService.getBid(productId);
  }
}
