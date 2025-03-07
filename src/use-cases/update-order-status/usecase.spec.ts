import UpdateOrderStatusUseCase from './usecase';
import OrderRepository from '../../shared/repositories/orderRepository';
import { executeParamsType } from '../../shared/interfaces/usecase.interface';
import { badRequest, successResponse } from '../../shared/api-gateway-response';

jest.mock('../../shared/repositories/orderRepository');

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = new OrderRepository() as jest.Mocked<OrderRepository>;
    useCase = new UpdateOrderStatusUseCase(orderRepository);
  });

  it('should return 400 if orderId is missing', async () => {
    const params = {
      pathParameters: {},
      body: { status: 'DELIVERED' },
    } as executeParamsType;

    const result = await useCase.execute(params);

    expect(result).toEqual(badRequest('OrderId is required'));
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should return 400 if status is invalid', async () => {
    const params: executeParamsType = {
      pathParameters: { orderId: 'order123' },
      body: { status: 'INVALID_STATUS' },
    } as any;

    const result = await useCase.execute(params);

    const errorBody = JSON.parse(result.body || '{}');
    expect(errorBody).toHaveProperty('error.status');
    expect(Array.isArray(errorBody.error.status._errors)).toBe(true);
    expect(errorBody.error.status._errors[0]).toContain('Invalid enum value');
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should return 200 and update the status if valid', async () => {
    orderRepository.updateStatus.mockResolvedValue(null);

    const params: executeParamsType = {
      pathParameters: { orderId: 'order123' },
      body: { status: 'DELIVERED' },
    } as any;

    const result = await useCase.execute(params);

    expect(result).toEqual(
      successResponse({ message: `Status updated for Order: order123` }),
    );
    expect(orderRepository.updateStatus).toHaveBeenCalledWith(
      'order123',
      'DELIVERED',
    );
  });
});
