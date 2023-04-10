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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { Request, Express } from 'express';
import { GetUserId } from 'src/common/decorators';
import { ResponseDto, PageDto, PageOptionsDto } from 'src/common/dtos';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Req() { url }: Request,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    return await this.productsService.getProducts(pageOptionsDto, url);
  }

  @UseGuards(AuthGuard())
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

  @UseGuards(AuthGuard())
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ResponseDto<string>> {
    return await this.productsService.uploadImage(image);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  async getProductById(@Param('id') productId: string): Promise<Product> {
    return await this.productsService.getProductById(productId);
  }

  @UseGuards(AuthGuard())
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

  @UseGuards(AuthGuard())
  @Delete(':id')
  async deleteProductById(
    @Param('id') productId: string,
    @GetUserId() userId: string,
  ): Promise<ResponseDto<Product>> {
    return await this.productsService.deleteProduct(productId, userId);
  }
}
