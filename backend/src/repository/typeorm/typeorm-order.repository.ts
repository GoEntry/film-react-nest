import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from '../interfaces/order-repository.interface';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderTicketDto,
} from '../../order/dto/order.dto';
import { Schedule } from '../entities/schedule.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

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

    // Собираем информацию о сеансах для билетов
    const sessionInfo = new Map<string, { daytime: string }>();

    for (const ticket of createOrderDto.tickets) {
      const sessionId = ticket.session;
      if (!sessionInfo.has(sessionId)) {
        const session = await this.scheduleRepository.findOne({
          where: { id: sessionId },
        });
        if (session) {
          // Получаем текущую дату в формате ISO
          const today = new Date().toISOString().split('T')[0];
          // Добавляем полную дату к времени сеанса
          const fullDaytime = `${today}T${session.daytime}:00`;
          sessionInfo.set(sessionId, { daytime: fullDaytime });
        }
      }
    }

    // Формируем результат
    const items: OrderTicketDto[] = createOrderDto.tickets.map((ticket) => {
      const session = sessionInfo.get(ticket.session);
      return {
        ...ticket,
        id: uuidv4(),
        daytime: session?.daytime || ticket.daytime,
      };
    });

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
    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, film_id: filmId },
    });

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
    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, film_id: filmId },
    });

    if (!session) {
      throw new BadRequestException(`Сеанс с ID ${sessionId} не найден`);
    }

    // Обновляем список занятых мест
    const updatedTaken = [...new Set([...session.taken, ...places])];

    await this.scheduleRepository.update(
      { id: sessionId, film_id: filmId },
      { taken: updatedTaken },
    );

    return true;
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
    return tickets.map((ticket) => `${ticket.row}-${ticket.seat}`);
  }
}
