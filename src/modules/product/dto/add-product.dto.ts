import { Product } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class AddProductDto {
	@IsNumber()
	id: number;

	@IsNumber()
	count: number;
}
