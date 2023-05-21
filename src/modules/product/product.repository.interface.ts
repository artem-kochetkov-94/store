import { Product } from '@prisma/client';
import { ProductEntity } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductDto } from './dto/add-product.dto';
import { FindProductDto } from './dto/find-product.dto';

export interface IProductRepository {
	getProductList: () => Promise<Product[]>;
	createProduct: (product: ProductEntity) => Promise<Product>;
	deleteProduct: (id: Product['id']) => Promise<Product>;
	updateProduct: (body: UpdateProductDto | AddProductDto) => Promise<Product>;
	findProductById: (id: Product['id']) => Promise<Product | null>;
	findProductList: (body: FindProductDto) => Promise<Product[]>;
}
