import type {
  Context,
  APIGatewayProxyStructuredResultV2,
  APIGatewayProxyEventV2,
} from 'aws-lambda';

import { UseCase } from './interfaces/usecase.interface';
import { errorResponse } from './api-gateway-response';

export abstract class BaseController {
  constructor(private useCase: UseCase) {}

  async handle(
    event: APIGatewayProxyEventV2,
    _context: Context,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    try {
      const { body, pathParameters, queryStringParameters } = event;
      const customBody = body ? JSON.parse(body) : null;

      const result = await this.useCase.execute({
        body: customBody,
        pathParameters,
        queryStringParameters,
      });

      return result;
    } catch (err) {
      return errorResponse(err);
    }
  }
}
