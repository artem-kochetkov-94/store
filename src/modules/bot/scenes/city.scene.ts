import { Scenes } from 'telegraf';
import { MyContext, TextNarrowedContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { CityActions } from './types/city.scene.types';

const cities = ['Оренбург', 'Москва'];

export class CityScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor() {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.City);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private handleStart(ctx: MyContext): void {
		ctx.reply('Укажите свой город');
	}

	private handleBack(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.Main);
	}

	private handleText(ctx: TextNarrowedContext): void {
		const city = ctx.message.text;

		if (!cities.includes(city)) {
			ctx.reply('В данный город доставка не осуществляется');
		} else {
			// Сохранение адреса доставки в контексте пользователя
			ctx.session.city = city;
			ctx.scene.enter(ScenesNames.Address);
		}
	}

	public init(): void {
		this._scene.command(CityActions.Back, this.handleBack.bind(this));
		this._scene.enter(this.handleStart.bind(this));
		this._scene.on('text', this.handleText.bind(this));
	}
}
