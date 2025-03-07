import GetUserOrdersUseCase from './usecase';
import OrderRepository from '../../shared/repositories/orderRepository';
import { executeParamsType } from '../../shared/interfaces/usecase.interface';
import { badRequest, successResponse } from '../../shared/api-gateway-response';
import { OrderModel } from '../../shared/models/orderModel';

jest.mock('../../shared/repositories/orderRepository');

describe('GetUserOrdersUseCase', () => {
  let useCase: GetUserOrdersUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = new OrderRepository() as jest.Mocked<OrderRepository>;
    useCase = new GetUserOrdersUseCase(orderRepository);
  });

  it('should return 400 if userId is missing', async () => {
    const params = { pathParameters: {} } as executeParamsType;

    const result = await useCase.execute(params);

    expect(result).toEqual(badRequest('UserId is required'));
    expect(orderRepository.getByUserId).not.toHaveBeenCalled();
  });

  it('should return 200 and an empty list if user has no orders', async () => {
    orderRepository.getByUserId.mockResolvedValue([]);

    const params: executeParamsType = {
      pathParameters: { userId: 'user123' },
    } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(successResponse([]));
    expect(orderRepository.getByUserId).toHaveBeenCalledWith('user123');
  });

  it('should return 200 and the list of orders if user has orders', async () => {
    const orders = [
      new OrderModel({ orderId: 'order1', userId: 'user123', products: [] }),
      new OrderModel({ orderId: 'order2', userId: 'user123', products: [] }),
    ];

    orderRepository.getByUserId.mockResolvedValue(orders);

    const params: executeParamsType = {
      pathParameters: { userId: 'user123' },
    } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(successResponse(orders));
    expect(orderRepository.getByUserId).toHaveBeenCalledWith('user123');
  });
});
