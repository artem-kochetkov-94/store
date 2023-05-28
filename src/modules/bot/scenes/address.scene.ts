import { Scenes } from 'telegraf';
import { MyContext, TextNarrowedContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { AddressActions } from './types';

export class AddressScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor() {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.Address);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private handleBack(ctx: MyContext): void {
		ctx.scene.enter(ScenesNames.City);
	}

	private handleStart(ctx: MyContext): void {
		ctx.reply('Укажите адрес доставки');
	}

	private handleText(ctx: TextNarrowedContext): void {
		ctx.session.address = ctx.message.text;
		ctx.scene.enter(ScenesNames.Main);
	}

	public init(): void {
		this._scene.command(AddressActions.Back, this.handleBack.bind(this));
		this._scene.enter(this.handleStart.bind(this));
		this._scene.on('text', this.handleText.bind(this));
	}
}
