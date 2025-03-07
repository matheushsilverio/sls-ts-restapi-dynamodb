import DeleteOrderUseCase from './usecase';
import OrderRepository from '../../shared/repositories/orderRepository';
import {
  badRequest,
  notFoundResponse,
  successResponse,
} from '../../shared/api-gateway-response';
import { OrderModel, Order } from '../../shared/models/orderModel';

jest.mock('../../shared/repositories/orderRepository');

describe('DeleteOrderUseCase', () => {
  let useCase: DeleteOrderUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = new OrderRepository() as jest.Mocked<OrderRepository>;
    useCase = new DeleteOrderUseCase(orderRepository);
  });

  it('should return 400 if orderId is missing', async () => {
    const params = { pathParameters: {} } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(badRequest('OrderId is required'));

    expect(orderRepository.getById).not.toHaveBeenCalled();
    expect(orderRepository.delete).not.toHaveBeenCalled();
  });

  it('should return 404 if order does not exist', async () => {
    orderRepository.getById.mockResolvedValue(null);

    const params = { pathParameters: { orderId: 'order123' } } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(
      notFoundResponse('Order with ID order123 not found, try with another ID'),
    );
    expect(orderRepository.getById).toHaveBeenCalledWith('order123');
    expect(orderRepository.delete).not.toHaveBeenCalled();
  });

  it('should delete order successfully', async () => {
    const order = new OrderModel({ orderId: 'order123' }) as unknown as Order;
    orderRepository.getById.mockResolvedValue(order);
    orderRepository.delete.mockResolvedValue(undefined);

    const params = { pathParameters: { orderId: 'order123' } } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(
      successResponse({ message: 'Order deleted successfully' }),
    );
    expect(orderRepository.getById).toHaveBeenCalledWith('order123');
    expect(orderRepository.delete).toHaveBeenCalledWith('order123');
  });
});
