import { Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { IConfigService } from '../../config';
import { MyContext, ScenesNames } from './types';
import { MainScene } from './scenes/main.scene';
import { CityScene } from './scenes/city.scene';
import { AddressScene } from './scenes/address.scene';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IProductRepository } from '../product/interfaces';
import { ProductListScene } from './scenes/product-list.scene';
import { ProductScene } from './scenes/product.scene';
import { OrderScene } from './scenes/order.scene';

export interface IBot {
	init(): void;
}

@injectable()
export class Bot implements IBot {
	bot: Telegraf<MyContext>;
	stage: Scenes.Stage<MyContext>;

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ProductRepositry) private productRepository: IProductRepository.ProductRepository,
	) {
		this.bot = new Telegraf<MyContext>(this.configService.get('TELEGRAM_TOKEN'));
		this.bot.use(new LocalSession({ database: 'session.json' }).middleware());
		this.bot.use((ctx, next) => {
			next();
		});
	}

	init(): void {
		const scenes = [
			new MainScene(),
			new CityScene(),
			new AddressScene(),
			new ProductListScene(this.productRepository),
			new ProductScene(this.productRepository),
			new OrderScene(),
		];
		scenes.map((scene) => scene.init());

		this.stage = new Scenes.Stage<MyContext>(scenes.map((item) => item.scene));
		this.bot.use(this.stage.middleware());

		this.bot.command('start', (ctx) => {
			ctx.scene.enter(ScenesNames.Main);
		});

		this.bot.launch();
	}
}
