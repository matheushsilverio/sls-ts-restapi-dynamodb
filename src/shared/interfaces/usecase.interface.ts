import type {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

export type executeParamsType = {
  pathParameters: APIGatewayProxyEventPathParameters | undefined;
  body: any | undefined;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | undefined;
};

export interface UseCase {
  execute(
    params: executeParamsType,
  ): Promise<APIGatewayProxyStructuredResultV2>;
}
