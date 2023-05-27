import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

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
				[Markup.button.callback('Изменить параметры доставки', 'startAction')],
				[Markup.button.callback('Список товаров', 'productListAction')],
				[Markup.button.callback('Поиск товара', 'searchProductAction')],
			]);
		}

		return Markup.inlineKeyboard([
			[Markup.button.callback('Заполнить параметры доставки', 'startAction')],
		]);
	}

	public init(): void {
		this._scene.enter((ctx) => {
			ctx.reply('Меню', this.getMenu(ctx));
		});

		this._scene.action('startAction', (ctx) => {
			ctx.scene.enter(ScenesNames.City);
		});

		this._scene.action('productListAction', (ctx) => {
			ctx.scene.enter(ScenesNames.ProductList);
		});

		this._scene.on('text', (ctx) => {
			ctx.reply('Меню', this.getMenu(ctx));
		});
	}
}
