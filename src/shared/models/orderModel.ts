import { Item } from 'dynamoose/dist/Item';
import dynamoose from '../database/dynamoose-config';

export class Order extends Item {
  orderId: string;
  userId: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const stage = String(process.env.STAGE) || 'dev';
const tableName = `${stage}-orders`;

const OrderSchema = new dynamoose.Schema(
  {
    orderId: {
      type: String,
      hashKey: true,
      required: true,
    },
    userId: {
      type: String,
      index: {
        type: 'global',
        name: 'userIdIndex',
      },
      required: true,
    },
    products: {
      type: Array,
      required: true,
      schema: [
        {
          type: Object,
          schema: {
            productId: String,
            name: String,
            quantity: Number,
            price: Number,
          },
        },
      ],
    },
    status: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: {
        createdAt: {
          type: {
            value: Date,
            settings: {
              storage: 'seconds',
            },
          },
        },
      },
      updatedAt: {
        updatedAt: {
          type: {
            value: Date,
            settings: {
              storage: 'seconds',
            },
          },
        },
      },
    },
  },
);

export const OrderModel = dynamoose.model<Order>(tableName, OrderSchema);
