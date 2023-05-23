import { PrismaClient } from '@prisma/client';
import { UserCreateDto } from '../src/modules/users/dto/user-create.dto';
import { USER_ROLE } from '../types/user-role';
import { UserEntity } from '../src/modules/users/user.entity';
import { ConfigService } from '../src/config/config.service';
import { LoggerService } from '../src/logger/logger.service';
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

export const roles = [
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

async function main(): Promise<void> {
	for (const data of roles) {
		await prisma.role.create({
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
