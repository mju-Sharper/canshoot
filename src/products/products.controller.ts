import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { GetUserId } from 'src/common/decorators';
import { ResponseDto, PageDto, PageOptionsDto } from 'src/common/dtos';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Req() { url }: Request,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    return this.productsService.getProducts(pageOptionsDto, url);
  }

  @Post()
  async createProducts(
    @Body() createProductDto: CreateProductDto,
    @GetUserId() sellerId: string,
  ): Promise<ResponseDto<Product>> {
    return await this.productsService.createProducts(
      createProductDto,
      sellerId,
    );
  }

  @Get(':id')
  async getProductById(@Param('id') productId: string): Promise<Product> {
    return await this.productsService.getProductById(productId);
  }

  @Patch(':id')
  async updateProductById(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') productId: string,
    @GetUserId() userId: string,
  ): Promise<ResponseDto<Product>> {
    return await this.productsService.updateProduct(
      productId,
      userId,
      updateProductDto,
    );
  }

  @Delete(':id')
  async deleteProductById(
    @Param('id') productId: string,
    @GetUserId() userId: string,
  ): Promise<ResponseDto<Product>> {
    return await this.productsService.deleteProduct(productId, userId);
  }
}
