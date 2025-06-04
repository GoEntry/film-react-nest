import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderRepository } from '../interfaces/order-repository.interface';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderTicketDto,
} from '../../order/dto/order.dto';
import { Film, FilmDocument } from '../schemas/film.schema';
import { v4 as uuidv4 } from 'uuid';
import { ScheduleDto } from '../../films/dto/films.dto';

@Injectable()
export class MongoOrderRepository implements OrderRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Группируем билеты по фильму и сеансу для оптимизации проверки
    const ticketsBySession = this.groupTicketsBySession(createOrderDto.tickets);

    // Для каждой группы проверяем доступность мест
    for (const [key, tickets] of Object.entries(ticketsBySession)) {
      const [filmId, sessionId] = key.split(':');

      // Получаем места для проверки
      const places = this.getPlacesFromTickets(tickets);

      // Проверяем доступность мест
      const available = await this.checkPlacesAvailability(
        filmId,
        sessionId,
        places,
      );

      if (!available) {
        throw new BadRequestException(
          `Некоторые места уже заняты: ${places.join(', ')}`,
        );
      }
    }

    // Бронируем все места
    for (const [key, tickets] of Object.entries(ticketsBySession)) {
      const [filmId, sessionId] = key.split(':');
      const places = this.getPlacesFromTickets(tickets);

      await this.reservePlaces(filmId, sessionId, places);
    }

    // Формируем результат
    const items: OrderTicketDto[] = createOrderDto.tickets.map((ticket) => ({
      ...ticket,
      id: uuidv4(),
    }));

    return {
      total: items.length,
      items,
    };
  }

  async checkPlacesAvailability(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();

    if (!film) {
      throw new BadRequestException(`Фильм с ID ${filmId} не найден`);
    }

    // Находим сеанс
    const session = film.schedule.find((s) => s.id === sessionId);

    if (!session) {
      throw new BadRequestException(`Сеанс с ID ${sessionId} не найден`);
    }

    // Проверяем, есть ли запрашиваемые места в списке занятых
    const takenPlaces = session.taken || [];
    const unavailablePlaces = places.filter((place) =>
      takenPlaces.includes(place),
    );

    return unavailablePlaces.length === 0;
  }

  async reservePlaces(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    // Используем атомарную операцию MongoDB для обновления списка занятых мест
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
        },
        {
          $addToSet: { 'schedule.$.taken': { $each: places } },
        },
      )
      .exec();

    return result.modifiedCount > 0;
  }

  private groupTicketsBySession(
    tickets: CreateOrderDto['tickets'],
  ): Record<string, CreateOrderDto['tickets']> {
    const groups: Record<string, CreateOrderDto['tickets']> = {};

    tickets.forEach((ticket) => {
      const key = `${ticket.film}:${ticket.session}`;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(ticket);
    });

    return groups;
  }

  private getPlacesFromTickets(tickets: CreateOrderDto['tickets']): string[] {
    return tickets.map((ticket) => `${ticket.row}:${ticket.seat}`);
  }

  private mapToScheduleDto(schedule: any): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken || [],
    };
  }
}
