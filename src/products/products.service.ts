import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  async getProducts() {
    return 'return products';
  }

  async createProducts() {
    return `create product`;
  }

  async getProductById(productId: string) {
    return `return product ${productId}`;
  }

  async updateProductById(productId: string) {
    return `update product ${productId}`;
  }

  async deleteProductById(productId: string) {
    return `delete product ${productId}`;
  }
}
