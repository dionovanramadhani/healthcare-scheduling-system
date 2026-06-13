import { SetMetadata } from '@nestjs/common';
import 'dotenv/config';

export const IS_PUBLIC_KEY = process.env.PUBLIC_KEY;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
