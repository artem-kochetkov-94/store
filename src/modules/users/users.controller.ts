import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { HTTPError } from '../../errors/http-error.class';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../../config/config.service.interface';
import { IUserService } from './users.service.interface';
import { AuthGuard } from '../../common/auth.guard';
import { RoleGuard } from '../../common/role.guard';
import { UserCreateDto } from './dto/user-create.dto';
import { USER_ROLE } from '../../../types/user-role';
import { SetUserPasswordDto } from './dto/set-user-password.dto';
import { User } from '@prisma/client';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/create-user',
				method: 'post',
				func: this.createUser,
				middlewares: [
					new AuthGuard(),
					new RoleGuard(USER_ROLE.ADMIN, this.userService),
					new ValidateMiddleware(UserCreateDto),
				],
			},
			{
				path: '/delete-user-password',
				method: 'post',
				func: this.deleteUserPassword,
				middlewares: [new AuthGuard(), new RoleGuard(USER_ROLE.ADMIN, this.userService)],
			},
			{
				path: '/set-user-password',
				method: 'put',
				func: this.setUserPassword,
				middlewares: [
					new AuthGuard(),
					new RoleGuard(USER_ROLE.ADMIN, this.userService),
					new ValidateMiddleware(SetUserPasswordDto),
				],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'ошибка авторизации', 'login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	// создание админа для тестирования
	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createAdmin(body);

		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}

	// TODO: валидация роли
	async createUser(
		{ body }: Request<{}, {}, UserCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	async deleteUserPassword(
		{ body, user }: Request<{}, {}, Pick<User, 'id'>>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const iam = await this.userService.getUserInfo(user);
		if (iam?.id === body.id) {
			return next(new HTTPError(400, 'Нельзя удалить пароль самому себе'));
		}

		const result = await this.userService.deleteUserPassword(body.id);

		if (!result) {
			return next(new HTTPError(400, 'Bad Request	'));
		}

		this.ok(res, result);
	}

	async setUserPassword(
		{ body }: Request<{}, {}, SetUserPasswordDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.setUserPassword(body);

		if (!result) {
			return next(new HTTPError(400, 'Bad Request'));
		}

		this.ok(res, result);
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
