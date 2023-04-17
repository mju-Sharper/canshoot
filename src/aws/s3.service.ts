import { Injectable, Inject, HttpException } from '@nestjs/common';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Express } from 'express';
import { AWS_MODULE_OPTIONS } from 'src/common/consts';
import { v4 } from 'uuid';

import { AwsModuleOptions } from './aws.module';

@Injectable()
export class S3Service {
  readonly client: S3Client;

  constructor(@Inject(AWS_MODULE_OPTIONS) readonly options: AwsModuleOptions) {
    this.client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  async uploadImage(image: Express.Multer.File) {
    try {
      const path = `product_image/${v4()}`;
      await this.client.send(
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
