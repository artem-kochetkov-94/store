import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './modules/users/users.controller';
import { UsersRepository } from './modules/users/users.repository';
import { UserService } from './modules/users/users.service';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';
import { ProductRepository } from './modules/product/product.repository';
import {
	IProductController,
	IProductRepository,
	IProductService,
} from './modules/product/interfaces';
import { IUserController, IUserService, IUsersRepository } from './modules/users/interfaces';
import { Bot, IBot } from './modules/bot';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

	bind<IProductController>(TYPES.ProductController).to(ProductController);
	bind<IProductService.ProductService>(TYPES.ProductService).to(ProductService);
	bind<IProductRepository.ProductRepository>(TYPES.ProductRepositry).to(ProductRepository);

	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService.UserService>(TYPES.UserService).to(UserService);
	bind<IUsersRepository.UsersRepository>(TYPES.UsersRepository)
		.to(UsersRepository)
		.inSingletonScope();

	bind<IBot>(TYPES.Bot).to(Bot);

	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	await app.init();

	return { appContainer, app };
}

export const boot = bootstrap();
