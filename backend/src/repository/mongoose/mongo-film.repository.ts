import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmRepository } from '../interfaces/film-repository.interface';
import { Film, FilmDocument } from '../schemas/film.schema';
import {
  FilmDto,
  FilmResponseDto,
  ScheduleDto,
  ScheduleResponseDto,
} from '../../films/dto/films.dto';

@Injectable()
export class MongoFilmRepository implements FilmRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<FilmResponseDto> {
    const films = await this.filmModel.find().exec();

    const items = films.map((film) => this.mapToFilmDto(film));

    return {
      total: items.length,
      items,
    };
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmModel.findOne({ id }).exec();

    if (!film) {
      return { total: 0, items: [] };
    }

    const items = film.schedule.map((schedule) =>
      this.mapToScheduleDto(schedule),
    );

    return {
      total: items.length,
      items,
    };
  }

  private mapToFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private mapToScheduleDto(schedule: any): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall.toString(),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken || [],
    };
  }
}
