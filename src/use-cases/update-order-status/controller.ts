import { Handler } from 'aws-lambda';
import { BaseController } from '../../shared/base.controller';
import OrderRepository from '../../shared/repositories/orderRepository';
import UpdateOrderStatusUseCase from './usecase';

class UpdateOrderStatusController extends BaseController {
  constructor() {
    const orderRepository = new OrderRepository();
    const useCase = new UpdateOrderStatusUseCase(orderRepository);
    super(useCase);
  }
}
const controller = new UpdateOrderStatusController();
export const handler: Handler = controller.handle.bind(controller);
