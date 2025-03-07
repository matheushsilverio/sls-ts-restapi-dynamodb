import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import {
  UseCase,
  executeParamsType,
} from '../../shared/interfaces/usecase.interface';
import OrderRepository from '../../shared/repositories/orderRepository';
import { badRequest, successResponse } from '../../shared/api-gateway-response';
import {
  UpdateOrderStatusValidatedDTO,
  updateOrderStatusValidatorSchema,
} from './validator';

export default class UpdateOrderStatusUseCase implements UseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    params: executeParamsType,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    const { body, pathParameters } = params;

    const orderId = pathParameters?.orderId;

    if (!orderId) {
      return badRequest('OrderId is required');
    }

    const validation = updateOrderStatusValidatorSchema.safeParse(body);
    if (!validation.success) {
      return badRequest(validation.error.format());
    }

    const { status }: UpdateOrderStatusValidatedDTO = validation.data;

    await this.orderRepository.updateStatus(orderId, status);

    return successResponse({ message: `Status updated for Order: ${orderId}` });
  }
}
