import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { TYPES } from '../../types';
import { ProductEntity } from './product.entity';
import { IProductRepository } from './product.repository.interface';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductDto } from './dto/add-product.dto';
import { FindProductDto } from './dto/find-product.dto';

@injectable()
export class ProductRepository implements IProductRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async getProductList(): Promise<Product[]> {
		return this.prismaService.client.product.findMany();
	}

	async createProduct({ title, description, count }: ProductEntity): Promise<Product> {
		return this.prismaService.client.product.create({
			data: {
				title,
				count,
				description,
			},
		});
	}

	async deleteProduct(id: Product['id']): Promise<Product> {
		return this.prismaService.client.product.delete({
			where: {
				id,
			},
		});
	}

	async updateProduct({ id, data }: UpdateProductDto | AddProductDto): Promise<Product> {
		return this.prismaService.client.product.update({
			where: {
				id,
			},
			data,
		});
	}

	async findProductById(id: Product['id']): Promise<Product | null> {
		return this.prismaService.client.product.findFirst({
			where: {
				id,
			},
		});
	}

	async findProductList({ title, description, count }: FindProductDto): Promise<Product[]> {
		const where: Record<string, any> = {};

		if (count) {
			where.count = count;
		}

		return this.prismaService.client.product.findMany({
			where: {
				...where,
				AND: {
					title: {
						contains: title || '',
					},
					description: {
						contains: description || '',
					},
				},
			},
		});
	}
}
