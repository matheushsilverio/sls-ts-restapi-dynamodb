import { z } from 'zod';

export const updateOrderStatusValidatorSchema = z.object({
  status: z.enum([
    'RECEIVED',
    'IN_PREPARATION',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
});

export type UpdateOrderStatusValidatedDTO = z.infer<
  typeof updateOrderStatusValidatorSchema
>;
