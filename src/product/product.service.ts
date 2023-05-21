import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IProductService } from './product.service.interface';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { IProductRepository } from './product.repository.interface';
import { ProductEntity } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductDto } from './dto/add-product.dto';
import { FindProductDto } from './dto/find-product.dto';

@injectable()
export class ProductService implements IProductService {
	constructor(@inject(TYPES.ProductRepositry) private productRepository: IProductRepository) {}

	async getProductList(): Promise<Product[]> {
		return this.productRepository.getProductList();
	}

	async createProduct({ title, description }: CreateProductDto): Promise<Product | null> {
		const newProduct = new ProductEntity(title, description);
		return this.productRepository.createProduct(newProduct);
	}

	async deleteProduct(id: Product['id']): Promise<Product | null> {
		if (!(await this.findProductById(id))) {
			return null;
		}

		return this.productRepository.deleteProduct(id);
	}

	async updateProduct(body: UpdateProductDto): Promise<Product | null> {
		if (!(await this.findProductById(body.id))) {
			return null;
		}

		return this.productRepository.updateProduct(body);
	}

	async addProducts(body: AddProductDto): Promise<Product | null> {
		const existedProduct = await this.findProductById(body.id);

		if (!existedProduct) {
			return null;
		}

		return this.productRepository.updateProduct({
			...body,
			data: {
				count: existedProduct.count + body.data.count,
			},
		});
	}

	async findProductById(id: Product['id']): Promise<Product | null> {
		const existedProduct = await this.productRepository.findProductById(id);

		if (!existedProduct) {
			return null;
		}

		return existedProduct;
	}

	async findProduct(body: FindProductDto): Promise<Product[]> {
		return this.productRepository.findProductList(body);
	}
}
