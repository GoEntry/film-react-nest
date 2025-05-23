import {
  FilmResponseDto,
  ScheduleResponseDto,
} from '../../films/dto/films.dto';

export interface FilmRepository {
  /**
   * Получить список всех фильмов
   */
  findAll(): Promise<FilmResponseDto>;

  /**
   * Получить расписание сеансов для конкретного фильма
   * @param id ID фильма
   */
  findScheduleByFilmId(id: string): Promise<ScheduleResponseDto>;
}
