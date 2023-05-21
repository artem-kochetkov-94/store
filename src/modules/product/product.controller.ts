import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../common/base.controller';
import { IProductController } from './product.controller.interface';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { inject, injectable } from 'inversify';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductDto } from './dto/add-product.dto';
import { AuthGuard } from '../../common/auth.guard';
import { UserService } from '../users/users.service';
import { RoleGuard } from '../../common/role.guard';
import { USER_ROLE } from '../../../types/user-role';
import { HTTPError } from '../../errors/http-error.class';
import { FindProductDto } from './dto/find-product.dto';

@injectable()
export class ProductController extends BaseController implements IProductController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ProductService) private productService: ProductService,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/list',
				method: 'get',
				func: this.getProductList,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/create',
				method: 'post',
				func: this.createProduct,
				middlewares: [
					new AuthGuard(),
					new RoleGuard(USER_ROLE.ADMIN, this.userService),
					new ValidateMiddleware(CreateProductDto),
				],
			},
			{
				path: '/delete',
				method: 'delete',
				func: this.deleteProduct,
				middlewares: [new AuthGuard(), new RoleGuard(USER_ROLE.ADMIN, this.userService)],
			},
			{
				path: '/update',
				method: 'put',
				func: this.updateProduct,
				middlewares: [new AuthGuard(), new RoleGuard(USER_ROLE.ADMIN, this.userService)],
			},
			{
				path: '/add',
				method: 'put',
				func: this.addProducts,
				middlewares: [new AuthGuard(), new RoleGuard(USER_ROLE.STOCK_MANAGER, this.userService)],
			},
			{
				path: '/find',
				method: 'get',
				func: this.findProductList,
				middlewares: [new AuthGuard(), new ValidateMiddleware(FindProductDto)],
			},
		]);
	}

	async getProductList(_req: Request, res: Response): Promise<void> {
		const productList = await this.productService.getProductList();
		this.ok(res, productList);
	}

	async createProduct(
		{ body }: Request<{}, {}, CreateProductDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.productService.createProduct(body);

		if (!result) {
			return next(new HTTPError(400, 'Bad Request	'));
		}

		this.ok(res, result);
	}

	async deleteProduct(
		{ body }: Request<{}, {}, Pick<Product, 'id'>>,
		res: Response,
	): Promise<void> {
		await this.productService.deleteProduct(body.id);
		this.ok(res, 'Продукт удален');
	}

	async updateProduct(
		{ body }: Request<{}, {}, UpdateProductDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.productService.updateProduct(body);

		if (!result) {
			return next(new HTTPError(400, 'Bad Request	'));
		}

		this.ok(res, result);
	}

	async addProducts(
		{ body }: Request<{}, {}, AddProductDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.productService.addProducts(body);

		if (!result) {
			return next(new HTTPError(400, 'Bad Request	'));
		}

		this.ok(res, result);
	}

	async findProductList({ body }: Request<{}, {}, FindProductDto>, res: Response): Promise<void> {
		const productList = await this.productService.findProduct(body);
		this.ok(res, productList);
	}
}
