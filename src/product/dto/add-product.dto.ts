import { Product } from '@prisma/client';
import { IsNumber, IsObject } from 'class-validator';

class AddProductDtoData {
	@IsNumber()
	count: number;
}

export class AddProductDto {
	@IsNumber()
	id: Product['id'];

	@IsObject()
	data: AddProductDtoData;
}
