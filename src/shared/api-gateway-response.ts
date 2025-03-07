import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export function successResponse<T>(
  data: T,
  statusCode = 200,
): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
}

export function notFoundResponse(
  message = 'Resource not found',
): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: message }),
  };
}

export function createdResponse<T>(data: T): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
}

export function errorResponse(
  err: Error | string,
  statusCode = 500,
): APIGatewayProxyStructuredResultV2 {
  const message = typeof err === 'string' ? err : err.message;

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: message }),
  };
}

export function badRequest(
  message: any = 'Bad Request',
): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 400,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: message }),
  };
}
