import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Controller('api/afisha/films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmResponseDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.filmsService.getFilmSchedule(id);
  }
}
