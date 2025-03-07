import { Order, OrderModel } from '../models/orderModel';

export default class OrderRepository {
  private model: any;

  constructor() {
    this.model = OrderModel;
  }

  async create(order: Order): Promise<Order> {
    return await this.model.create(order);
  }

  async getById(orderId: string): Promise<Order | null> {
    return await this.model.get({ orderId });
  }

  async getByUserId(userId: string): Promise<Order[]> {
    return await this.model.query('userId').eq(userId).exec();
  }

  async updateStatus(orderId: string, status: string): Promise<Order | null> {
    return await this.model.update({ orderId }, { status });
  }

  async delete(orderId: string): Promise<void> {
    await this.model.delete({ orderId });
  }
}
