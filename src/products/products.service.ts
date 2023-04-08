import { Injectable } from '@nestjs/common';

import { ResponseDto, PageOptionsDto, PageDto } from 'src/common/dtos';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductRepository) {}

  async getProducts(
    pageOptionsDto: PageOptionsDto,
    url: string,
  ): Promise<PageDto<Product>> {
    return this.productRepository.getProducts(pageOptionsDto, url);
  }

  async createProducts(
    createProductDto: CreateProductDto,
    sellerId: string,
  ): Promise<ResponseDto<Product>> {
    const createdProduct = await this.productRepository.createProduct(
      createProductDto,
      sellerId,
    );
    return new ResponseDto('상품 등록이 완료되었습니다.', { createdProduct });
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
  ): Promise<ResponseDto<Product>> {
    const updatedProduct = await this.productRepository.updateProduct(
      productId,
      userId,
      updateProductDto,
    );
    return new ResponseDto('상품 업데이트가 완료되었습니다.', {
      updatedProduct,
    });
  }

  async deleteProduct(
    productId: string,
    userId: string,
  ): Promise<ResponseDto<Product>> {
    const deletedProduct = await this.productRepository.deleteProduct(
      productId,
      userId,
    );
    return new ResponseDto('상품 삭제가 완료되었습니다.', { deletedProduct });
  }
}
