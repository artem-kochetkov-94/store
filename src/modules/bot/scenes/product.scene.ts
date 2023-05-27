import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { IProductRepository } from '../../product/interfaces';

export class ProductScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor(private productRepository: IProductRepository.ProductRepository) {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.Product);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	public init(): void {
		this._scene.command('back', (ctx) => ctx.scene.enter(ScenesNames.ProductList));

		this._scene.enter(async (ctx) => {
			const product = await this.productRepository.findProductById(ctx.session.selectedProductId);

			ctx.reply(
				`Title: ${product?.title}; Description: ${product?.description}; Count: ${product?.count}`,
				Markup.inlineKeyboard([Markup.button.callback('Назад к списку товаров', 'backAction')]),
			);
		});

		this._scene.action('backAction', (ctx) => {
			ctx.scene.enter(ScenesNames.ProductList);
		});
	}
}
