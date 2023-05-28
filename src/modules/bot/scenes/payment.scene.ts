import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { PaymentActions } from './types';
import { IProductService } from '../../product/interfaces';

export class PaymentScene extends Scene {
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

	private async getPrice(ctx: MyContext): Promise<number> {
		const order = ctx.session.order;
		const productIds = Object.keys(order).map((key) => Number(key));
		const products = await this.productService.findProductListByIds(productIds);

		const orderPrice = products.reduce((acc, current) => (acc += current.price), 0);

		return orderPrice;
	}

	private async handleEnter(ctx: MyContext): Promise<void> {
		const orderPrice = await this.getPrice(ctx);

		ctx.replyWithHTML(
			`Total price: ${orderPrice}.`,
			Markup.inlineKeyboard([
				[Markup.button.callback('Назад к списку', PaymentActions.Back)],
				[Markup.button.callback('Оплатить', PaymentActions.Pay)],
			]),
		);
	}

	private handlePay(ctx: MyContext): void {
		ctx.reply('Спасибо за покупку!');
	}

	public init(): void {
		this._scene.enter(this.handleEnter.bind(this));
		this._scene.action(PaymentActions.Back, this.handleBack.bind(this));
		this._scene.action(PaymentActions.Pay, this.handlePay.bind(this));
	}
}
