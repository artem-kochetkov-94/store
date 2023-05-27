import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { MainActions } from './types/main.scene.types';

export class MainScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor() {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.Main);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private getMenu(ctx: MyContext): Markup.Markup<InlineKeyboardMarkup> {
		if (ctx.session.city && ctx.session.address) {
			return Markup.inlineKeyboard([
				[Markup.button.callback('Изменить параметры доставки', MainActions.Start)],
				[Markup.button.callback('Список товаров', MainActions.RedirectToProductList)],
				[Markup.button.callback('Поиск товара', MainActions.RedirectToSearchProduct)],
				[Markup.button.callback('Корзина', MainActions.RedirectToOrder)],
			]);
		}

		return Markup.inlineKeyboard([
			[Markup.button.callback('Заполнить параметры доставки', MainActions.Start)],
		]);
	}

	private handleStart(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.City);
	}

	private handleRedirectToProductList(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.ProductList);
	}

	private handleRedirectToOrdert(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Order);
	}

	private showMenu(ctx: MyContext): void {
		ctx.reply('Меню', this.getMenu(ctx));
	}

	// private handleRedirectToSearchProduct(ctx: MyContext): void {}

	public init(): void {
		this._scene.enter(this.showMenu.bind(this));
		this._scene.action(MainActions.Start, this.handleStart.bind(this));
		this._scene.action(
			MainActions.RedirectToProductList,
			this.handleRedirectToProductList.bind(this),
		);
		this._scene.action(MainActions.RedirectToOrder, this.handleRedirectToOrdert.bind(this));
		this._scene.on('text', this.showMenu.bind(this));
	}
}
