import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PageDto,
  PageOptionsDto,
  PageMetaDto,
  PageLinkDto,
} from 'src/common/dtos';
import { Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(
    pageOptionsDto: PageOptionsDto,
    url: string,
  ): Promise<PageDto<Product>> {
    const { order, skip, take, category, search } = pageOptionsDto;
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.skip(skip).take(take);

    if (category) {
      queryBuilder.andWhere('product.category= :category', { category });
    }
    if (search) {
      queryBuilder.andWhere('product.name like :search', {
        search: `%${search}%`,
      });
    }
    if (order) {
      queryBuilder.orderBy('product.startingBid', order);
    }
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const pageLinkDto = new PageLinkDto({
      url,
      itemCount,
      pageOptionsDto,
    });
    return new PageDto(entities, pageMetaDto, pageLinkDto);
  }

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
