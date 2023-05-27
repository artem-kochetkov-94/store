import { Markup, Scenes } from 'telegraf';
import { Product } from '@prisma/client';
import { InlineKeyboardButton, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

import { Scene } from './abstract.scene.class';
import { IProductRepository } from '../../product/interfaces';
import { CallbackQueryContext, MyContext, ScenesNames } from '../types';
import { ProductListActions, ProductState } from './types';

export class ProductListScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor(private productRepository: IProductRepository.ProductRepository) {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.ProductList);
		this.productRepository = productRepository;
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private handleBack(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Main);
	}

	private async handleEnter(ctx: MyContext): Promise<void> {
		const products = await this.productRepository.getProductList();

		ctx.reply('Список товаров', this.getMarkupTemplate(ctx, products));
	}

	private getMarkupTemplate(
		ctx: MyContext,
		products: Product[],
	): Markup.Markup<InlineKeyboardMarkup> {
		const navigationKeyboard = this.getNavigationTemplate(ctx);
		const productListKeyboard = this.getProductListTemplate(ctx, products);

		return Markup.inlineKeyboard([navigationKeyboard, ...productListKeyboard]);
	}

	private getNavigationTemplate(ctx: MyContext): InlineKeyboardButton[] {
		const backButtonTemplate = Markup.button.callback('Назад к меню', ProductListActions.Back);
		const goToOrderTemplate = Markup.button.callback('В корзину', ProductListActions.GoToOrder);

		if (ctx.session.order && Object.keys(ctx.session.order).length > 0) {
			return [backButtonTemplate, goToOrderTemplate];
		}

		return [backButtonTemplate];
	}

	private getProductListTemplate(ctx: MyContext, products: Product[]): InlineKeyboardButton[][] {
		const template = [
			...products.map((product) => {
				const productInOrder = (ctx.session.order && ctx.session.order[product.id]) || null;
				return [
					Markup.button.callback(
						productInOrder
							? `${product.title} (в корзине ${productInOrder.count} шт.)`
							: product.title,
						`productDetailAction-${product.id}`,
					),
				];
			}),
		];

		return template;
	}

	private handleDetailProductClick(ctx: CallbackQueryContext): void {
		const id = ctx.match[1];
		const state: ProductState = { id: Number(id) };

		ctx.scene.enter(ScenesNames.Product, state);
	}

	public init(): void {
		this._scene.command('back', this.handleBack.bind(this));
		this._scene.enter(this.handleEnter.bind(this));
		this._scene.action(/^productDetailAction-(\d+)$/, this.handleDetailProductClick.bind(this));
		this._scene.action(ProductListActions.Back, this.handleBack.bind(this));
	}
}
