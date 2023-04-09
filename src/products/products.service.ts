import { Injectable, HttpException } from '@nestjs/common';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';
import { S3Service } from 'src/aws/s3.service';
import { ResponseDto, PageOptionsDto, PageDto } from 'src/common/dtos';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private productRepository: ProductRepository,
    private s3Service: S3Service,
  ) {}

  async getProducts(
    pageOptionsDto: PageOptionsDto,
    url: string,
  ): Promise<PageDto<Product>> {
    return this.productRepository.getProducts(pageOptionsDto, url);
  }

  async createProducts(
    createProductDto: CreateProductDto,
    sellerId: string,
    image: Express.Multer.File,
  ): Promise<ResponseDto<Product>> {
    const imageUrl = await this.uploadImage(image);
    const createdProduct = await this.productRepository.createProduct(
      createProductDto,
      sellerId,
      imageUrl,
    );
    return new ResponseDto('상품 등록이 완료되었습니다.', {
      createdProduct,
    });
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

  async uploadImage(image: Express.Multer.File): Promise<string> {
    try {
      const path = `product_image/${image.originalname}`;
      await this.s3Service.client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: path,
          Body: image.buffer,
          ACL: 'public-read',
          ContentType: 'image/jpeg',
        }),
      );
      return `${process.env.AWS_S3_BUCKET_URL}/${path}`;
    } catch (e) {
      throw new HttpException(
        {
          error: '잠시후 다시 시도해주세요.',
        },
        500,
      );
    }
  }
}
