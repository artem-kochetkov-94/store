import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductDto } from './dto/add-product.dto';
import { FindProductDto } from './dto/find-product.dto';

export interface IProductService {
	getProductList: () => Promise<Product[]>;
	createProduct: (dto: CreateProductDto) => Promise<Product | null>;
	deleteProduct: (id: Product['id']) => Promise<Product | null>;
	updateProduct: (body: UpdateProductDto) => Promise<Product | null>;
	addProducts: (body: AddProductDto) => Promise<Product | null>;
	findProductById: (id: Product['id']) => Promise<Product | null>;
	findProduct: (body: FindProductDto) => Promise<Product[]>;
}
