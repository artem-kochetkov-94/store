import { User } from '@prisma/client';
import { Container } from 'inversify';
import 'reflect-metadata';

import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { USER_ROLE } from '../../../types/user-role';

import { UserEntity } from './user.entity';
import { UserService } from './users.service';
import { IUserService, IUsersRepository } from './interfaces';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository.UsersRepository = {
	findByEmail: jest.fn(),
	createUser: jest.fn(),
	findById: jest.fn(),
	checkRole: jest.fn(),
	deleteUserPassword: jest.fn(),
	setUserPassword: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository.UsersRepository;
let usersService: IUserService.UserService;

beforeAll(() => {
	container.bind<IUserService.UserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container
		.bind<IUsersRepository.UsersRepository>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository.UsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService.UserService>(TYPES.UserService);
});

let createdUser: User | null;
let createdAdmin: User | null;

describe('User Service', () => {
	it('createAdmin', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.createUser = jest.fn().mockImplementationOnce(
			(user: UserEntity): User => ({
				id: 1,
				name: user.name,
				email: user.email,
				password: user.password,
			}),
		);
		createdAdmin = await usersService.createAdmin({
			email: 'admin@mail.ru',
			name: 'admin',
			password: 'admin',
		});
		expect(usersRepository.createUser).toBeCalledWith({
			_email: 'admin@mail.ru',
			_name: 'admin',
			_password: createdAdmin?.password,
			_roleName: USER_ROLE.ADMIN,
		});
	});

	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.createUser = jest.fn().mockImplementationOnce(
			(user: UserEntity): User => ({
				id: 2,
				name: user.name,
				email: user.email,
				password: user.password,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'user@mail.ru',
			name: 'user',
			password: 'user',
			roleName: USER_ROLE.STOCK_MANAGER,
		});
		expect(createdUser?.id).toEqual(2);
		expect(createdUser?.password).not.toEqual('user');
	});

	it('create the same user', async () => {
		usersRepository.findByEmail = jest.fn().mockReturnValueOnce(createdUser);
		const createdUserTheSame: User | null = await usersService.createUser({
			email: 'user@mail.ru',
			name: 'user',
			password: 'user',
			roleName: USER_ROLE.ADMIN,
		});
		expect(createdUserTheSame).toEqual(null);
	});

	it('validateUser - success', async () => {
		usersRepository.findByEmail = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'user@mail.ru',
			password: 'user',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.findByEmail = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'user@mail.ru',
			password: 'wrong',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.findByEmail = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'wrong@mail.ru',
			password: 'user',
		});
		expect(res).toBeFalsy();
	});

	it('setUserPassword', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.findById = jest.fn().mockReturnValueOnce(createdUser);
		usersRepository.setUserPassword = jest.fn().mockImplementationOnce(() => ({
			...createdUser,
			password: 'new password',
		}));

		createdUser = await usersService.setUserPassword(2, 'new password');

		usersRepository.findByEmail = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: 'user@mail.ru',
			password: 'user',
		});

		expect(res).toBeFalsy();
	});

	it('deleteUserPassword', async () => {
		usersRepository.findById = jest.fn().mockReturnValueOnce(createdUser);
		usersRepository.deleteUserPassword = jest.fn().mockImplementationOnce(() => ({
			...createdUser,
			password: '',
		}));

		createdUser = await usersService.deleteUserPassword(2);

		usersRepository.findByEmail = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: 'user@mail.ru',
			password: 'user',
		});

		expect(res).toBeFalsy();
	});
});
