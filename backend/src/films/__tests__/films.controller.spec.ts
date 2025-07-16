import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';
import { FilmResponseDto, ScheduleResponseDto } from '../dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  // Мок данных для тестов
  const mockFilmResponse: FilmResponseDto = {
    total: 2,
    items: [
      {
        id: '1',
        title: 'Test Film 1',
        rating: 8.5,
        director: 'Test Director 1',
        tags: ['action', 'drama'],
        about: 'Short description 1',
        description: 'Full description 1',
        image: '/image1.jpg',
        cover: '/cover1.jpg',
      },
      {
        id: '2',
        title: 'Test Film 2',
        rating: 7.8,
        director: 'Test Director 2',
        tags: ['comedy'],
        about: 'Short description 2',
        description: 'Full description 2',
        image: '/image2.jpg',
        cover: '/cover2.jpg',
      },
    ],
  };

  const mockScheduleResponse: ScheduleResponseDto = {
    total: 2,
    items: [
      {
        id: 'schedule1',
        daytime: '2023-07-15T18:00:00Z',
        hall: 'Hall 1',
        rows: 10,
        seats: 20,
        price: 500,
        taken: ['1:1', '2:3'],
      },
      {
        id: 'schedule2',
        daytime: '2023-07-15T20:30:00Z',
        hall: 'Hall 2',
        rows: 8,
        seats: 15,
        price: 600,
        taken: ['3:5'],
      },
    ],
  };

  beforeEach(async () => {
    // Создаем мок для FilmsService
    const mockFilmsService = {
      getFilms: jest.fn().mockResolvedValue(mockFilmResponse),
      getFilmSchedule: jest.fn().mockResolvedValue(mockScheduleResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('should return an array of films', async () => {
      const result = await controller.getFilms();
      expect(result).toEqual(mockFilmResponse);
      expect(service.getFilms).toHaveBeenCalled();
    });
  });

  describe('getFilmSchedule', () => {
    it('should return schedule for a specific film', async () => {
      const filmId = '1';
      const result = await controller.getFilmSchedule(filmId);
      expect(result).toEqual(mockScheduleResponse);
      expect(service.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
