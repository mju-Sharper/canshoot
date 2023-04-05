import { Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Post()
  async createProducts() {
    return this.productsService.createProducts();
  }

  @Get('/:id')
  async getProductById(@Param('id') productId: string) {
    return this.productsService.getProductById(productId);
  }

  @Patch('/:id')
  async updateProductById(@Param('id') productId: string) {
    return this.productsService.updateProductById(productId);
  }

  @Delete('/:id')
  async deleteProductById(@Param('id') productId: string) {
    return this.productsService.deleteProductById(productId);
  }
}
