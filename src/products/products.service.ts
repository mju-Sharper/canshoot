import { Injectable } from '@nestjs/common';

import { ResponseDto } from 'src/common/dtos';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductRepository) {}

  async getProducts() {
    return 'return products';
  }

  async createProducts(
    createProductDto: CreateProductDto,
    sellerId: string,
  ): Promise<ResponseDto> {
    await this.productRepository.createProduct(createProductDto, sellerId);
    return new ResponseDto('상품 등록이 완료되었습니다.');
  }

  async getProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.getProductByIdOrFail(
      productId,
    );
    return product;
  }

  async updateProduct(
    productId: string,
    userId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ResponseDto> {
    await this.productRepository.updateProduct(
      productId,
      userId,
      updateProductDto,
    );
    return new ResponseDto('상품 업데이트가 완료되었습니다.');
  }

  async deleteProduct(productId: string, userId: string): Promise<ResponseDto> {
    await this.productRepository.deleteProduct(productId, userId);
    return new ResponseDto('상품 삭제가 완료되었습니다.');
  }
}
