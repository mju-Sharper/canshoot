import { DynamicModule, Module } from '@nestjs/common';

import { AWS_MODULE_OPTIONS } from 'src/common/consts';

import { S3Service } from './s3.service';

export interface AwsModuleOptions {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

@Module({})
export class AwsModule {
  static forRoot(options: AwsModuleOptions): DynamicModule {
    return {
      global: true,
      module: AwsModule,
      providers: [
        { provide: AWS_MODULE_OPTIONS, useValue: options },
        S3Service,
      ],
      exports: [S3Service],
    };
  }
}
