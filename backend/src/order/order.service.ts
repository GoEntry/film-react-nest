import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderRepository } from '../repository/interfaces/order-repository.interface';
import { ORDER_REPOSITORY } from '../repository/constants';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderRepository.createOrder(createOrderDto);
  }
}
