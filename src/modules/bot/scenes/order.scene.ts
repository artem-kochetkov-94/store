import { Markup, Scenes } from 'telegraf';
import { CallbackQueryContext, MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { ProductActions } from './types';
import { Product } from '@prisma/client';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { IProductRepository } from '../../product/interfaces';

export class OrderScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor(private productRepository: IProductRepository.ProductRepository) {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.Order);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private handleBack(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Main);
	}

	private handleEnter(ctx: MyContext): void {
		this.showOrder(ctx);
	}

	private getOrderTemplate(ctx: MyContext, products: Product[]): InlineKeyboardButton[][] {
		return [
			...products.map((product) => {
				const productInOrder = (ctx.session.order && ctx.session.order[product.id]) || null;
				return [
					Markup.button.callback(
						productInOrder
							? `${product.title} (в корзине ${productInOrder.count} шт.)`
							: product.title,
						'_',
					),
					Markup.button.callback('Удалить из корзины', `productDeleteAction-${product.id}`),
				];
			}),
		];
	}

	private async showOrder(ctx: MyContext): Promise<void> {
		const backTemplate = [Markup.button.callback('Назад в основное меню', ProductActions.Back)];
		const order = ctx.session.order;

		if (!order || Object.keys(order).length < 0) {
			ctx.reply('Корзина (пусто)', Markup.inlineKeyboard(backTemplate));
			return;
		}

		const productIds = Object.keys(order).map((key) => Number(key));
		const products = await this.productRepository.findProductListByIds(productIds);

		ctx.reply(
			'Корзина',
			Markup.inlineKeyboard([backTemplate, ...this.getOrderTemplate(ctx, products)]),
		);
	}

	private handleDeleteProductClick(ctx: CallbackQueryContext): void {
		const id = ctx.match[1];
		delete ctx.session.order[id];
		this.handleEnter(ctx);
	}

	public init(): void {
		this._scene.enter(this.handleEnter.bind(this));
		this._scene.action(ProductActions.Back, this.handleBack.bind(this));
		this._scene.action(/^productDeleteAction-(\d+)$/, this.handleDeleteProductClick.bind(this));
	}
}
