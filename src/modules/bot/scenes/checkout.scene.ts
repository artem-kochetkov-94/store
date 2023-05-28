import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { CheckoutActions } from './types';
import { IProductService } from '../../product/interfaces';
import { Product } from '@prisma/client';

export class CheckoutScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor(private productService: IProductService.ProductService) {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.Checkout);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private handleBack(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Order);
	}

	private getPrice(products: Product[]): number {
		return products.reduce((acc, current) => (acc += current.price), 0);
	}

	private async getOrderInfo(ctx: MyContext): Promise<string> {
		const order = ctx.session.order;

		const productIds = Object.keys(order).map((key) => Number(key));
		const products = await this.productService.findProductListByIds(productIds);

		let multilineText = '';
		for (const product of products) {
			multilineText += `
		${product.title} (${order[product.id].count} шт.);`;
		}

		multilineText += `
		Total price: ${this.getPrice(products)}.`;

		return multilineText;
	}

	private async handleEnter(ctx: MyContext): Promise<void> {
		const orderInfo = await this.getOrderInfo(ctx);

		ctx.replyWithHTML(
			`<pre>${orderInfo}</pre>`,
			Markup.inlineKeyboard([
				[Markup.button.callback('Назад к списку', CheckoutActions.Back)],
				[Markup.button.callback('Перейти к оплате', CheckoutActions.RedirectToPayment)],
			]),
		);
	}

	private handleRedirectToPayments(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Payment);
	}

	public init(): void {
		this._scene.enter(this.handleEnter.bind(this));
		this._scene.action(CheckoutActions.Back, this.handleBack.bind(this));
		this._scene.action(CheckoutActions.RedirectToPayment, this.handleRedirectToPayments.bind(this));
	}
}
