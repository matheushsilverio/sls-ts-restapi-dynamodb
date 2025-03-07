import OrderRepository from '../../shared/repositories/orderRepository';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import {
  executeParamsType,
  UseCase,
} from '../../shared/interfaces/usecase.interface';
import { badRequest, successResponse } from '../../shared/api-gateway-response';

export default class GetUserOrdersUseCase implements UseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    params: executeParamsType,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    const { pathParameters } = params;

    const userId = pathParameters?.userId;

    if (!userId) {
      return badRequest('UserId is required');
    }

    const orders = await this.orderRepository.getByUserId(userId);

    return successResponse(orders);
  }
}
