import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductByIdOrFail(id: string): Promise<Product> {
    const targetProduct = this.productRepository.findOneBy({
      id,
    });
    if (!targetProduct) {
      throw new BadRequestException({
        error: '유효하지 않은 상품 id입니다.',
      });
    }
    return targetProduct;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    sellerId: string,
  ): Promise<Product> {
    const { name, startingBid, auctionTime, category } = createProductDto;

    const product = this.productRepository.create({
      name,
      startingBid,
      auctionTime,
      category,
      sellerId,
    });

    await this.productRepository.save(product);
    return product;
  }

  async updateProduct(
    productId: string,
    userId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const targetProduct = await this.getProductByIdOrFail(productId);
    await this.catchInvalidUser(productId, userId);
    const updatedProduct = { ...targetProduct, ...updateProductDto };
    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(productId: string, userId: string): Promise<Product> {
    const targetProduct = await this.getProductByIdOrFail(productId);
    await this.catchInvalidUser(productId, userId);
    await this.productRepository.delete(productId);
    return targetProduct;
  }

  async catchInvalidUser(productId: string, userId: string): Promise<string> {
    const targetProduct = await this.getProductByIdOrFail(productId);
    if (targetProduct.sellerId !== userId) {
      throw new UnauthorizedException({
        error: '권한이 없습니다.',
      });
    }
    return 'this user has authority';
  }
}
