import CreateOrderUseCase from './usecase';
import OrderRepository from '../../shared/repositories/orderRepository';
import { executeParamsType } from '../../shared/interfaces/usecase.interface';

jest.mock('../../shared/repositories/orderRepository');

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = new OrderRepository() as jest.Mocked<OrderRepository>;
    useCase = new CreateOrderUseCase(orderRepository);
  });

  it('should return 400 if validation fails', async () => {
    const params: executeParamsType = {
      body: {},
    } as any;

    const result = await useCase.execute(params);
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if userId is missing', async () => {
    const params: executeParamsType = {
      body: {
        products: [
          { productId: 'p1', name: 'Product 1', quantity: 1, price: 10 },
        ],
        status: 'RECEIVED',
      },
    } as any;

    const result = await useCase.execute(params);

    expect(result.statusCode).toBe(400);
    expect(result).toHaveProperty('body', expect.anything());

    const errorBody = JSON.parse(result.body || '{}');
    expect(errorBody).toHaveProperty('error.userId');
    expect(errorBody.error.userId._errors).toContain('Required');
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('should create order successfully', async () => {
    const params: executeParamsType = {
      body: {
        userId: '123',
        products: [
          { productId: 'p1', name: 'Product 1', quantity: 2, price: 10 },
        ],
        status: 'RECEIVED',
      },
    } as any;

    orderRepository.create.mockResolvedValue({
      ...params.body,
      orderId: 'uuid-mock',
      totalPrice: 20,
    });

    const result = await useCase.execute(params);
    expect(result.statusCode).toBe(201);

    const bodyParsed = JSON.parse(result.body || '{}');

    expect(bodyParsed).toHaveProperty('orderId', expect.anything());
    expect(bodyParsed).toHaveProperty('userId', expect.anything());

    expect(orderRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if status is invalid', async () => {
    const params: executeParamsType = {
      body: {
        userId: '123',
        products: [
          { productId: 'p1', name: 'Product 1', quantity: 1, price: 10 },
        ],
        status: 'INVALID_STATUS',
      },
    } as any;

    const result = await useCase.execute(params);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('Invalid enum value');
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('should return 400 if products array is empty', async () => {
    const params: executeParamsType = {
      body: {
        userId: '123',
        products: [],
        status: 'RECEIVED',
      },
    } as any;

    const result = await useCase.execute(params);

    expect(result.statusCode).toBe(400);

    const errorBody = JSON.parse(result.body || '{}');
    expect(errorBody).toHaveProperty('error.products');
    expect(errorBody.error.products._errors).toContain(
      'At least one item is required',
    );
    expect(orderRepository.create).not.toHaveBeenCalled();
  });
});
