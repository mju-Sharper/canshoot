import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUserId } from 'src/common/decorators';

import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Post()
  async createProducts(
    @Body() createProductDto: CreateProductDto,
    @GetUserId() sellerId: string,
  ) {
    return await this.productsService.createProducts(
      createProductDto,
      sellerId,
    );
  }

  @Get(':id')
  async getProductById(@Param('id') productId: string) {
    return await this.productsService.getProductById(productId);
  }

  @Patch(':id')
  async updateProductById(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') productId: string,
    @GetUserId() userId: string,
  ) {
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
  ) {
    return await this.productsService.deleteProduct(productId, userId);
  }
}
