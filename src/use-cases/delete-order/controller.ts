import { Handler } from 'aws-lambda';
import { BaseController } from '../../shared/base.controller';
import OrderRepository from '../../shared/repositories/orderRepository';
import DeleteOrderUseCase from './usecase';

class DeleteOrderController extends BaseController {
  constructor() {
    const orderRepository = new OrderRepository();
    const useCase = new DeleteOrderUseCase(orderRepository);
    super(useCase);
  }
}
const controller = new DeleteOrderController();
export const handler: Handler = controller.handle.bind(controller);
