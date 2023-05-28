import { Markup, Scenes } from 'telegraf';
import { Product } from '@prisma/client';
import { InlineKeyboardButton, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

import { Scene } from './abstract.scene.class';
import { IProductService } from '../../product/interfaces';
import { CallbackQueryContext, MyContext, ScenesNames } from '../types';
import { ProductListActions, ProductState } from './types';

export class ProductListScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor(private productService: IProductService.ProductService) {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.ProductList);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private handleBack(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Main);
	}

	private handleRedirectToOrder(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Order);
	}

	private async handleEnter(ctx: MyContext): Promise<void> {
		const products = await this.productService.getProductList();

		ctx.reply('Список товаров', this.getMenuWithProducts(ctx, products));
	}

	private getMenuWithProducts(
		ctx: MyContext,
		products: Product[],
	): Markup.Markup<InlineKeyboardMarkup> {
		const navigationKeyboard = this.getMenuTemplate(ctx);
		const productListKeyboard = this.getProductListTemplate(ctx, products);

		return Markup.inlineKeyboard([navigationKeyboard, ...productListKeyboard]);
	}

	private getMenuTemplate(ctx: MyContext): InlineKeyboardButton[] {
		const backButton = Markup.button.callback('Назад к меню', ProductListActions.Back);
		const RedirectToOrderButton = Markup.button.callback(
			'В корзину',
			ProductListActions.RedirectToOrder,
		);

		if (ctx.session.order && Object.keys(ctx.session.order).length > 0) {
			return [backButton, RedirectToOrderButton];
		}

		return [RedirectToOrderButton];
	}

	private getProductListTemplate(ctx: MyContext, products: Product[]): InlineKeyboardButton[][] {
		return [
			...products.map((product) => {
				return [Markup.button.callback(product.title, `productDetailAction-${product.id}`)];
			}),
		];
		// return [
		// 	...products.map((product) => {
		// 		const productInOrder = ctx.session.order && ctx.session.order[product.id];
		// 		return [
		// 			Markup.button.callback(
		// 				productInOrder
		// 					? `${product.title} (в корзине ${productInOrder.count} шт.)`
		// 					: product.title,
		// 				`productDetailAction-${product.id}`,
		// 			),
		// 		];
		// 	}),
		// ];
	}

	private handleDetailProductClick(ctx: CallbackQueryContext): void {
		const id = ctx.match[1];
		const productState: ProductState = { id: Number(id) };

		ctx.scene.enter(ScenesNames.Product, productState);
	}

	public init(): void {
		this._scene.command(ProductListActions.Back, this.handleBack.bind(this));
		this._scene.enter(this.handleEnter.bind(this));
		this._scene.action(/^productDetailAction-(\d+)$/, this.handleDetailProductClick.bind(this));
		this._scene.action(ProductListActions.Back, this.handleBack.bind(this));
		this._scene.action(ProductListActions.RedirectToOrder, this.handleRedirectToOrder.bind(this));
	}
}
