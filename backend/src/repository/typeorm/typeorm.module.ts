import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { TypeOrmFilmRepository } from './typeorm-film.repository';
import { TypeOrmOrderRepository } from './typeorm-order.repository';
import { FILM_REPOSITORY, ORDER_REPOSITORY } from '../constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Используем простую конфигурацию без разбора URL
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST') || 'localhost',
          port: configService.get<number>('DATABASE_PORT') || 5432,
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME') || 'film_db',
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    {
      provide: FILM_REPOSITORY,
      useClass: TypeOrmFilmRepository,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: TypeOrmOrderRepository,
    },
  ],
  exports: [FILM_REPOSITORY, ORDER_REPOSITORY],
})
export class TypeOrmRepositoryModule {}
