import { Injectable, Inject } from '@nestjs/common';
import { FilmResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { FilmRepository } from '../repository/interfaces/film-repository.interface';
import { FILM_REPOSITORY } from '../repository/constants';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILM_REPOSITORY)
    private readonly filmRepository: FilmRepository,
  ) {}

  async getFilms(): Promise<FilmResponseDto> {
    return this.filmRepository.findAll();
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    return this.filmRepository.findScheduleByFilmId(id);
  }
}
