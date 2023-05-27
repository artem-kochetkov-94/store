import { Context, Scenes, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

export enum ScenesNames {
	Main = 'Main',
	City = 'City',
	Address = 'Address',
	ProductList = 'ProductList',
	Product = 'Product',
}

export interface MySessionScene extends Scenes.SceneSessionData {
	myProps: unknown;
}

export interface MySession extends Scenes.SceneSession<MySessionScene> {
	city: string;
	address: string;
	selectedProductId: number;
}

export interface MyContext extends Context {
	props: unknown;
	session: MySession;
	scene: Scenes.SceneContextScene<MyContext, MySessionScene>;
}

export type CTX = NarrowedContext<
	MyContext,
	{
		message: Update.New & Update.NonChannel & Message.TextMessage;
		update_id: number;
	}
>;
