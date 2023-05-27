import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { IProductRepository } from '../../product/interfaces';
import { ProductActions, ProductState, isProductState } from './types';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export class ProductScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;
	private state: ProductState;

	constructor(private productRepository: IProductRepository.ProductRepository) {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.Product);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private handleBack(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.ProductList);
	}

	private getMarkupTemplate(ctx: MyContext): Markup.Markup<InlineKeyboardMarkup> {
		const template = [
			[Markup.button.callback('Назад к списку', ProductActions.Back)],
			[Markup.button.callback('Добавить в корзину', ProductActions.AddToOrder)],
		];

		if (ctx.session.order && ctx.session.order[this.state.id.toString()]) {
			template.push([Markup.button.callback('Удалить из корзины', ProductActions.RemoveFromOrder)]);
		}

		return Markup.inlineKeyboard(template);
	}

	private async handleEnter(ctx: MyContext): Promise<void> {
		if (!isProductState(ctx.scene.state)) {
			this.handleError(ctx);
			return;
		}

		this.state = ctx.scene.state;

		const product = await this.productRepository.findProductById(this.state.id);

		ctx.reply(
			`Title: ${product?.title}; Description: ${product?.description}; Count: ${product?.count}`,
			this.getMarkupTemplate(ctx),
		);
	}

	private handleError(ctx: MyContext): void {
		ctx.reply(
			`Ошибка`,
			Markup.inlineKeyboard([
				[Markup.button.callback('Назад к списку товаров', ProductActions.Back)],
			]),
		);
	}

	private async handleAdd(ctx: MyContext): Promise<void> {
		ctx.session.order = {
			...ctx.session.order,
			[this.state.id.toString()]: {
				count: 1,
			},
		};

		await ctx.reply('Товар добавлен в корзину');
		await ctx.scene.enter(ScenesNames.ProductList);
	}

	private async handleRemove(ctx: MyContext): Promise<void> {
		delete ctx.session.order[this.state.id];

		await ctx.reply('Товар удален из корзины');
		await ctx.scene.enter(ScenesNames.ProductList);
	}

	public init(): void {
		this._scene.command('back', this.handleBack.bind(this));
		this._scene.enter(this.handleEnter.bind(this));
		this._scene.action(ProductActions.Back, this.handleBack.bind(this));
		this._scene.action(ProductActions.AddToOrder, this.handleAdd.bind(this));
		this._scene.action(ProductActions.RemoveFromOrder, this.handleRemove.bind(this));
	}
}
