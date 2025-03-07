import { Handler } from 'aws-lambda';
import { BaseController } from '../../shared/base.controller';
import OrderRepository from '../../shared/repositories/orderRepository';
import GetUserOrdersUseCase from './usecase';

class GetUserOrdersController extends BaseController {
  constructor() {
    const orderRepository = new OrderRepository();
    const useCase = new GetUserOrdersUseCase(orderRepository);
    super(useCase);
  }
}
const controller = new GetUserOrdersController();
export const handler: Handler = controller.handle.bind(controller);
