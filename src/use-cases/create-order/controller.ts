import { Handler } from 'aws-lambda';
import { BaseController } from '../../shared/base.controller';
import CreateOrderUseCase from './usecase';
import OrderRepository from '../../shared/repositories/orderRepository';

class CreateOrderController extends BaseController {
  constructor() {
    const orderRepository = new OrderRepository();
    const useCase = new CreateOrderUseCase(orderRepository);
    super(useCase);
  }
}
const controller = new CreateOrderController();
export const handler: Handler = controller.handle.bind(controller);
