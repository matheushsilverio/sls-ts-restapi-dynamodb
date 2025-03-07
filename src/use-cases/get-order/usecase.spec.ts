import GetOrderUseCase from './usecase';
import OrderRepository from '../../shared/repositories/orderRepository';
import { executeParamsType } from '../../shared/interfaces/usecase.interface';
import {
  badRequest,
  notFoundResponse,
  successResponse,
} from '../../shared/api-gateway-response';
import { OrderModel } from '../../shared/models/orderModel';

jest.mock('../../shared/repositories/orderRepository');

describe('GetOrderUseCase', () => {
  let useCase: GetOrderUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = new OrderRepository() as jest.Mocked<OrderRepository>;
    useCase = new GetOrderUseCase(orderRepository);
  });

  it('should return 400 if orderId is missing', async () => {
    const params = { pathParameters: {} } as executeParamsType;

    const result = await useCase.execute(params);

    expect(result).toEqual(badRequest('OrderId is required'));
    expect(orderRepository.getById).not.toHaveBeenCalled();
  });

  it('should return 404 if order does not exist', async () => {
    orderRepository.getById.mockResolvedValue(null);

    const params: executeParamsType = {
      pathParameters: { orderId: 'order123' },
    } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(notFoundResponse());
    expect(orderRepository.getById).toHaveBeenCalledWith('order123');
  });

  it('should return 200 and the order if it exists', async () => {
    const order = new OrderModel({
      orderId: 'order123',
      userId: 'user1',
      products: [],
    });
    orderRepository.getById.mockResolvedValue(order);

    const params: executeParamsType = {
      pathParameters: { orderId: 'order123' },
    } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(successResponse(order));
    expect(orderRepository.getById).toHaveBeenCalledWith('order123');
  });
});
