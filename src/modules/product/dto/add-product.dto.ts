import { Product } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class AddProductDto {
	@IsNumber()
	id: Product['id'];

	@IsNumber()
	count: number;
}
