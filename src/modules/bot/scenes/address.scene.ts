import { Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';

export class AddressScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor() {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.Address);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	public init(): void {
		this._scene.command('back', (ctx) => ctx.scene.enter(ScenesNames.City));

		this._scene.enter((ctx) => {
			ctx.reply('Укажите адрес доставки');
		});

		this._scene.on('text', (ctx) => {
			ctx.session.address = ctx.message.text;
			ctx.scene.enter(ScenesNames.Main);
		});
	}
}
