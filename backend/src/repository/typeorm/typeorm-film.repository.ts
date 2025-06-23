import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmRepository } from '../interfaces/film-repository.interface';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import {
  FilmDto,
  FilmResponseDto,
  ScheduleDto,
  ScheduleResponseDto,
} from '../../films/dto/films.dto';

@Injectable()
export class TypeOrmFilmRepository implements FilmRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmResponseDto> {
    const films = await this.filmRepository.find();

    const items = films.map((film) => this.mapToFilmDto(film));

    return {
      total: items.length,
      items,
    };
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleResponseDto> {
    const schedules = await this.scheduleRepository.find({
      where: { film_id: id },
    });

    if (!schedules.length) {
      return { total: 0, items: [] };
    }

    const items = schedules.map((schedule) => this.mapToScheduleDto(schedule));

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

  private mapToScheduleDto(schedule: Schedule): ScheduleDto {
    // Получаем текущую дату в формате ISO
    const today = new Date().toISOString().split('T')[0];

    // Комбинируем текущую дату с временем сеанса
    // Этот формат будет корректно обрабатываться dayjs на фронтенде
    const fullDaytime = `${today}T${schedule.daytime}:00`;

    return {
      id: schedule.id,
      daytime: fullDaytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken || [],
    };
  }
}
