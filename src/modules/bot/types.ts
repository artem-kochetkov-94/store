import { Context, NarrowedContext, Scenes } from 'telegraf';
import { CallbackQuery, Message, Update } from 'telegraf/typings/core/types/typegram';

export enum ScenesNames {
	Main = 'Main',
	City = 'City',
	Address = 'Address',
	ProductList = 'ProductList',
	Product = 'Product',
	Order = 'Order',
}

export interface MySessionScene extends Scenes.SceneSessionData {
	myProps: unknown;
}

export interface MySession extends Scenes.SceneSession<MySessionScene> {
	city: string;
	address: string;
	order: Record<
		string,
		{
			count: number;
		}
	>;
}

export interface MyContext extends Context {
	session: MySession;
	scene: Scenes.SceneContextScene<MyContext, MySessionScene>;
}

export type CallbackQueryContext = NarrowedContext<
	MyContext & {
		match: RegExpExecArray;
	},
	Update.CallbackQueryUpdate<CallbackQuery>
>;

export type NarrowedContext = NarrowedContext<
	MyContext,
	{
		message: Update.New & Update.NonChannel & Message.TextMessage;
		update_id: number;
	}
>;
