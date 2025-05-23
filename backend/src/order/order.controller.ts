import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('api/afisha/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.createOrder(createOrderDto);
  }
}
