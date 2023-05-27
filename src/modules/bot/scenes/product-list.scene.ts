import { Markup, Scenes } from 'telegraf';
import { MyContext, ScenesNames } from '../types';
import { Scene } from './abstract.scene.class';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { IProductRepository } from '../../product/interfaces';
import { Product } from '@prisma/client';

export class ProductListScene extends Scene {
	_scene: Scenes.BaseScene<MyContext>;

	constructor(private productRepository: IProductRepository.ProductRepository) {
		super();
		this._scene = new Scenes.BaseScene<MyContext>(ScenesNames.ProductList);
	}

	get scene(): Scenes.BaseScene<MyContext> {
		return this._scene;
	}

	private getProductListTemplate(products: Product[]): Markup.Markup<InlineKeyboardMarkup> {
		const template = [
			[Markup.button.callback('Назад к меню', 'backAction')],
			...products.map((product) => {
				return [Markup.button.callback(product.title, `productDetailAction-${product.id}`)];
			}),
		];

		return Markup.inlineKeyboard(template);
	}

	public init(): void {
		this._scene.command('back', (ctx) => ctx.scene.enter(ScenesNames.Main));

		this._scene.enter(async (ctx) => {
			const products = await this.productRepository.getProductList();
			ctx.reply('Список товаров', this.getProductListTemplate(products));
		});

		this._scene.action(/^productDetailAction-(\d+)$/, (ctx) => {
			const id = ctx.match[1];
			ctx.session.selectedProductId = Number(id);
			ctx.scene.enter(ScenesNames.Product);
		});

		this._scene.action('backAction', (ctx) => {
			ctx.scene.enter(ScenesNames.Main);
		});
	}
}
