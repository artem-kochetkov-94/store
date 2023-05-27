import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { ProductActions } from './types';

export class OrderScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor() {
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
		ctx.reply(
			'Корзина',
			Markup.inlineKeyboard([Markup.button.callback('Назад в основное меню', ProductActions.Back)]),
		);
	}

	public init(): void {
		this._scene.enter(this.handleEnter.bind(this));
		this._scene.action(ProductActions.Back, this.handleBack.bind(this));
	}
}
