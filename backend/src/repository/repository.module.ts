import { Module } from '@nestjs/common';
import { TypeOrmRepositoryModule } from './typeorm/typeorm.module';

@Module({
  imports: [TypeOrmRepositoryModule],
  exports: [TypeOrmRepositoryModule],
})
export class RepositoryModule {}
