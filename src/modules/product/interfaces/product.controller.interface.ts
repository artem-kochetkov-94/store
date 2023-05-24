import { NextFunction, Request, Response } from 'express';

export interface IProductController {
	getProductList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	createProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	addProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findProductList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
