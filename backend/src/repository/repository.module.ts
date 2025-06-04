import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Film, FilmSchema } from './schemas/film.schema';
import { MongoFilmRepository } from './mongoose/mongo-film.repository';
import { MongoOrderRepository } from './mongoose/mongo-order.repository';
import { FILM_REPOSITORY, ORDER_REPOSITORY } from './constants';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [
    {
      provide: FILM_REPOSITORY,
      useClass: MongoFilmRepository,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: MongoOrderRepository,
    },
  ],
  exports: [FILM_REPOSITORY, ORDER_REPOSITORY],
})
export class RepositoryModule {}
