import { IsString, IsOptional, IsNumber } from 'class-validator';

export class FindProductDto {
	@IsOptional()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsNumber()
	count: number;
}
