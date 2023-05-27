import { Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';

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

	public init(): void {
		this._scene.command('back', (ctx) => ctx.scene.enter(ScenesNames.Main));

		this._scene.enter((ctx) => {
			ctx.reply('Укажите свой город');
		});

		this._scene.on('text', (ctx) => {
			const city = ctx.message.text;

			if (!cities.includes(city)) {
				ctx.reply('В данный город доставка не осуществляется');
			} else {
				// Сохранение адреса доставки в контексте пользователя
				ctx.session.city = city;
				ctx.scene.enter(ScenesNames.Address);
			}
		});
	}
}
