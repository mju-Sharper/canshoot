import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';

import { TYPEORM_EX_CUSTOM_REPOSITORY } from 'src/const';
import { DataSource } from 'typeorm';

export class TypeOrmExModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    repositories.forEach((Repository) => {
      const entity = Reflect.getMetadata(
        TYPEORM_EX_CUSTOM_REPOSITORY,
        Repository,
      );

      if (!entity) {
        return;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: Repository,
        useFactory: (dataSource: DataSource): typeof Repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new Repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    });

    return {
      exports: providers,
      module: TypeOrmExModule,
      providers,
    };
  }
}
