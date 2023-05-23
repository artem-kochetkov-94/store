import { Product } from '@prisma/client';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateProductDto {
	@IsNumber()
	id: Product['id'];

	@IsOptional()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description: string;
}
