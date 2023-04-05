import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Category, Product } from './entities';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getProductByIdOrFail(id: string): Promise<Product> {
    const targetProduct = this.productRepository.findOneBy({
      id,
    });
    if (!targetProduct) {
      throw new BadRequestException({
        error: '잘못된 id입니다.',
      });
    }
    return targetProduct;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    sellerId: string,
  ): Promise<string> {
    const { name, startingBid, auctionTime, categoryId } = createProductDto;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new BadRequestException({
        error: '유효하지 않은 카테고리입니다.',
      });
    }

    const product = this.productRepository.create({
      name,
      startingBid,
      auctionTime,
      categoryId,
      sellerId,
    });

    await this.productRepository.save(product);
    return 'create product';
  }

  async updateProduct(
    productId: string,
    userId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<string> {
    await this.catchInvalidUser(productId, userId);
    await this.productRepository.update(productId, updateProductDto);
    return 'update product';
  }

  async deleteProduct(productId: string, userId: string): Promise<string> {
    await this.catchInvalidUser(productId, userId);
    await this.productRepository.delete(productId);
    return 'delete product';
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
