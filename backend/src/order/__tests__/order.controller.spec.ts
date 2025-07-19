import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { CreateOrderDto, OrderResponseDto } from '../dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  // Мок данных для тестов
  const mockCreateOrderDto: CreateOrderDto = {
    email: 'test@example.com',
    phone: '+79001234567',
    tickets: [
      {
        film: 'film1',
        session: 'session1',
        daytime: '2023-07-15T18:00:00Z',
        row: 5,
        seat: 10,
        price: 500,
      },
      {
        film: 'film1',
        session: 'session1',
        daytime: '2023-07-15T18:00:00Z',
        row: 5,
        seat: 11,
        price: 500,
      },
    ],
  };

  const mockOrderResponseDto: OrderResponseDto = {
    total: 2,
    items: [
      {
        id: 'ticket1',
        film: 'film1',
        session: 'session1',
        daytime: '2023-07-15T18:00:00Z',
        row: 5,
        seat: 10,
        price: 500,
      },
      {
        id: 'ticket2',
        film: 'film1',
        session: 'session1',
        daytime: '2023-07-15T18:00:00Z',
        row: 5,
        seat: 11,
        price: 500,
      },
    ],
  };

  beforeEach(async () => {
    // Создаем мок для OrderService
    const mockOrderService = {
      createOrder: jest.fn().mockResolvedValue(mockOrderResponseDto),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order and return tickets', async () => {
      const result = await controller.createOrder(mockCreateOrderDto);

      expect(result).toEqual(mockOrderResponseDto);
      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });
  });
});
