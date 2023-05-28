import { PrismaClient } from '@prisma/client';

import { USER_ROLE } from '../types/user-role';
import { UserEntity } from '../src/modules/users/user.entity';
import { ConfigService } from '../src/config/config.service';
import { LoggerService } from '../src/logger/logger.service';

import { UserCreateDto } from '../src/modules/users/dto';
import { IProductRepository } from '../src/modules/product/interfaces';
import 'reflect-metadata';

const prisma = new PrismaClient();

async function getUser(): Promise<UserCreateDto> {
	const configService = new ConfigService(new LoggerService());
	const salt = configService.get('SALT');
	const user = new UserEntity('user@mail.ru', 'user');
	await user.setPassword('user', Number(salt));
	user.setRoleName(USER_ROLE.ADMIN);

	return {
		email: user.email,
		password: user.password,
		name: user.name,
		roleName: user.roleName,
	};
}

const roles = [
	{
		id: 1,
		name: 'USER',
	},
	{
		id: 2,
		name: 'ADMIN',
	},
	{
		id: 3,
		name: 'STOCK_MANAGER',
	},
];

const products: IProductRepository.CreateProduct[] = [
	{
		title: 'title 1',
		description: 'description 1',
		count: 1,
		price: 100,
	},
	{
		title: 'title 2',
		description: 'description 2',
		count: 2,
		price: 200,
	},
	{
		title: 'title 3',
		description: 'description 3',
		count: 3,
		price: 300,
	},
];

async function main(): Promise<void> {
	for (const data of roles) {
		await prisma.role.create({
			data,
		});
	}

	for (const data of products) {
		await prisma.product.create({
			data,
		});
	}

	const { email, password, name, roleName } = await getUser();

	await prisma.user.create({
		data: {
			email,
			password,
			name,
			roles: {
				create: [
					{
						role: {
							create: {
								name: roleName || USER_ROLE.USER,
							},
						},
					},
				],
			},
		},
	});
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
