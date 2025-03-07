import { z } from 'zod';

export const createOrderValidatorSchema = z.object({
  orderId: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  products: z
    .array(
      z.object({
        productId: z.string().min(1, 'Item ID is required'),
        name: z.string().min(1, 'Item name is required'),
        quantity: z
          .number()
          .int()
          .positive('Quantity must be a positive integer'),
        price: z.number().positive('Price must be a positive number'),
      }),
    )
    .min(1, 'At least one item is required'),
  status: z.enum([
    'RECEIVED',
    'IN_PREPARATION',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  totalPrice: z.number().positive().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CreateOrderValidatedDTO = z.infer<
  typeof createOrderValidatorSchema
>;
