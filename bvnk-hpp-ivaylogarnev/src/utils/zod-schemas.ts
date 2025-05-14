import { z } from 'zod';

export const uuidSchema = {
  uuid: z.string().uuid('Please enter a valid UUID')
};
