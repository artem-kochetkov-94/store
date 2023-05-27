import { Product } from '@prisma/client';

export namespace IProductService {
	export interface CreateProduct {
		title: string;
		description: string;
	}

	export interface UpdateProduct {
		id: number;
		title?: string;
		description?: string;
	}

	export interface FindProduct {
		title?: string;
		description?: string;
		count?: number;
	}

	export interface ProductService {
		getProductList: () => Promise<Product[]>;
		createProduct: (data: CreateProduct) => Promise<Product | null>;
		deleteProduct: (id: number) => Promise<Product | null>;
		updateProduct: (data: UpdateProduct) => Promise<Product | null>;
		addProducts: (id: number, count: number) => Promise<Product | null>;
		findProductById: (id: number) => Promise<Product | null>;
		findProduct: (data: FindProduct) => Promise<Product[]>;
	}
}
