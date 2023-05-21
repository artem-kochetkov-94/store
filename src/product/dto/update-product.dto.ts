import { Product } from '@prisma/client';
import { IsNumber, IsString, IsObject, IsOptional } from 'class-validator';

class UpdateProductData {
	@IsOptional()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description: string;
}

export class UpdateProductDto {
	@IsNumber()
	id: Product['id'];

	@IsObject()
	data: UpdateProductData;
}
