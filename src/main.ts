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
import { IUserController } from './modules/users/users.controller.interface';
import { UsersRepository } from './modules/users/users.repository';
import { IUsersRepository } from './modules/users/users.repository.interface';
import { UserService } from './modules/users/users.service';
import { IUserService } from './modules/users/users.service.interface';
import { IProductController } from './modules/product/product.controller.interface';
import { ProductController } from './modules/product/product.controller';
import { IProductService } from './modules/product/product.service.interface';
import { ProductService } from './modules/product/product.service';
import { IProductRepository } from './modules/product/product.repository.interface';
import { ProductRepository } from './modules/product/product.repository';

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
	bind<IProductService>(TYPES.ProductService).to(ProductService);
	bind<IProductRepository>(TYPES.ProductRepositry).to(ProductRepository);

	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();

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
