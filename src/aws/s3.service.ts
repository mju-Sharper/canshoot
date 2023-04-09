import { Injectable, Inject } from '@nestjs/common';

import { S3Client } from '@aws-sdk/client-s3';
import { AWS_MODULE_OPTIONS } from 'src/common/consts';

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
}
