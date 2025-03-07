import { Handler } from 'aws-lambda';
import { BaseController } from '../../shared/base.controller';
import OrderRepository from '../../shared/repositories/orderRepository';
import GetOrderUseCase from './usecase';

class GetOrderController extends BaseController {
  constructor() {
    const orderRepository = new OrderRepository();
    const useCase = new GetOrderUseCase(orderRepository);
    super(useCase);
  }
}
const controller = new GetOrderController();
export const handler: Handler = controller.handle.bind(controller);
