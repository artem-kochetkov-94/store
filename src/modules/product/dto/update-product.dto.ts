import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateProductDto {
	@IsNumber()
	id: number;

	@IsOptional()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description: string;
}
