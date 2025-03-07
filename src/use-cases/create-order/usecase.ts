import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import {
  UseCase,
  executeParamsType,
} from '../../shared/interfaces/usecase.interface';
import { badRequest, createdResponse } from '../../shared/api-gateway-response';
import OrderRepository from '../../shared/repositories/orderRepository';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderModel } from '../../shared/models/orderModel';
import {
  createOrderValidatorSchema,
  CreateOrderValidatedDTO,
} from './validator';

export default class CreateOrderUseCase implements UseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    params: executeParamsType,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    const { body } = params;

    const validation = createOrderValidatorSchema.safeParse(body);
    if (!validation.success) {
      return badRequest(validation.error.format());
    }

    const bodyParsed: CreateOrderValidatedDTO = validation.data;

    const totalPrice = bodyParsed.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    const createOrder = new OrderModel({
      ...bodyParsed,
      orderId: uuidv4(),
      totalPrice,
    }) as Order;

    const created = await this.orderRepository.create(createOrder);

    return createdResponse(created);
  }
}
