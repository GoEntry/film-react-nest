import { CreateOrderDto, OrderResponseDto } from '../../order/dto/order.dto';

export interface OrderRepository {
  /**
   * Создание заказа билетов с проверкой доступности мест
   * @param createOrderDto Данные заказа
   */
  createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;

  /**
   * Проверяет, свободны ли места на указанном сеансе фильма
   * @param filmId ID фильма
   * @param sessionId ID сеанса
   * @param places Массив мест в формате ["row:seat", ...]
   */
  checkPlacesAvailability(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean>;

  /**
   * Бронирует места на указанном сеансе фильма
   * @param filmId ID фильма
   * @param sessionId ID сеанса
   * @param places Массив мест в формате ["row:seat", ...]
   */
  reservePlaces(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean>;
}
