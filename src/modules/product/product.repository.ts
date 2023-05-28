import { inject, injectable } from 'inversify';
import { Product } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { TYPES } from '../../types';

import { IProductRepository } from './interfaces';

@injectable()
export class ProductRepository implements IProductRepository.ProductRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async getProductList(): Promise<Product[]> {
		return this.prismaService.client.product.findMany();
	}

	async createProduct({
		title,
		description,
		count,
		price,
	}: IProductRepository.CreateProduct): Promise<Product> {
		return this.prismaService.client.product.create({
			data: {
				title,
				description,
				count,
				price,
			},
		});
	}

	async deleteProduct(id: number): Promise<Product> {
		return this.prismaService.client.product.delete({
			where: {
				id,
			},
		});
	}

	async updateProduct({ id, ...data }: IProductRepository.UpdateProduct): Promise<Product> {
		return this.prismaService.client.product.update({
			where: {
				id,
			},
			data,
		});
	}

	async findProductById(id: number): Promise<Product | null> {
		return this.prismaService.client.product.findFirst({
			where: {
				id,
			},
		});
	}

	async findProductList({
		title,
		description,
		count,
	}: IProductRepository.FindProduct): Promise<Product[]> {
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

	async findProductListByIds(ids: number[]): Promise<Product[]> {
		return this.prismaService.client.product.findMany({
			where: {
				id: { in: ids },
			},
		});
	}
}
