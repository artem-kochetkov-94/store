import { PrismaClient } from '@prisma/client';
import { UserCreateDto } from '../src/modules/users/dto/user-create.dto';
import { USER_ROLE } from '../types/user-role';

const prisma = new PrismaClient();

export const users = [
	{
		email: 'user@mail.ru',
		password: 'user',
		name: 'user',
		roleName: USER_ROLE.ADMIN,
	},
];

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

	for (const { email, password, name, roleName } of users) {
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
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
