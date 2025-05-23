//TODO реализовать DTO для /orders

export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderTicketDto extends TicketDto {
  id: string;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

export class OrderResponseDto {
  total: number;
  items: OrderTicketDto[];
}

export class ErrorDto {
  error: string;
}
