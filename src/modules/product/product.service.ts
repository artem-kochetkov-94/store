import { inject, injectable } from 'inversify';
import { Product } from '@prisma/client';

import { TYPES } from '../../types';

import { ProductEntity } from './product.entity';
import { IProductRepository, IProductService } from './interfaces';

@injectable()
export class ProductService implements IProductService.ProductService {
	constructor(
		@inject(TYPES.ProductRepositry) private productRepository: IProductRepository.ProductRepository,
	) {}

	async getProductList(): Promise<Product[]> {
		return this.productRepository.getProductList();
	}

	async createProduct({
		title,
		description,
	}: IProductService.CreateProduct): Promise<Product | null> {
		const newProduct = new ProductEntity(title, description);
		return this.productRepository.createProduct(newProduct);
	}

	async deleteProduct(id: number): Promise<Product | null> {
		const product = await this.findProductById(id);
		if (!product) {
			return null;
		}

		return this.productRepository.deleteProduct(id);
	}

	async updateProduct(data: IProductService.UpdateProduct): Promise<Product | null> {
		const product = await this.findProductById(data.id);
		if (!product) {
			return null;
		}

		return this.productRepository.updateProduct(data);
	}

	async addProducts(id: number, count: number): Promise<Product | null> {
		const existedProduct = await this.findProductById(id);

		if (!existedProduct) {
			return null;
		}

		return this.productRepository.updateProduct({
			id,
			count: existedProduct.count + count,
		});
	}

	async findProductById(id: number): Promise<Product | null> {
		const existedProduct = await this.productRepository.findProductById(id);

		if (!existedProduct) {
			return null;
		}

		return existedProduct;
	}

	async findProduct(data: IProductService.FindProduct): Promise<Product[]> {
		return this.productRepository.findProductList(data);
	}
}
