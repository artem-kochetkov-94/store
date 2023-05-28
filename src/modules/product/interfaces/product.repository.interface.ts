import { Product } from '@prisma/client';

export namespace IProductRepository {
	export interface CreateProduct {
		title: string;
		description: string;
		count: number;
		price: number;
	}

	export interface UpdateProduct {
		id: number;
		title?: string;
		description?: string;
		count?: number;
		price?: number;
	}

	export interface FindProduct {
		title?: string;
		description?: string;
		count?: number;
	}

	export interface ProductRepository {
		getProductList: () => Promise<Product[]>;
		createProduct: (product: CreateProduct) => Promise<Product>;
		deleteProduct: (id: number) => Promise<Product>;
		updateProduct: (body: UpdateProduct) => Promise<Product>;
		findProductById: (id: number) => Promise<Product | null>;
		findProductList: (body: FindProduct) => Promise<Product[]>;
		findProductListByIds(ids: number[]): Promise<Product[]>;
	}
}
