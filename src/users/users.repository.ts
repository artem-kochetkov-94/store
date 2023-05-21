import { User } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { UserEntity } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { Role } from '@prisma/client';
import { USER_ROLE } from '../../types/user-role';
import { SetUserPasswordDto } from './dto/set-user-password.dto';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async findByEmail(email: User['email']): Promise<User | null> {
		return this.prismaService.client.user.findFirst({
			where: {
				email,
			},
		});
	}

	async findById(id: User['id']): Promise<User | null> {
		return this.prismaService.client.user.findFirst({
			where: {
				id,
			},
		});
	}

	async checkRole(email: User['email'], roleName: Role['name']): Promise<User | null> {
		return this.prismaService.client.user.findFirst({
			where: {
				email,
				roles: {
					some: {
						role: {
							name: roleName,
						},
					},
				},
			},
		});
	}

	async createUser({ email, password, name, roleName }: UserEntity): Promise<User> {
		return this.prismaService.client.user.create({
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

	async deleteUserPassword(id: User['id']): Promise<User | null> {
		return this.prismaService.client.user.update({
			where: {
				id,
			},
			data: {
				password: '',
			},
		});
	}

	async setUserPassword({ id, password }: SetUserPasswordDto): Promise<User | null> {
		return this.prismaService.client.user.update({
			where: {
				id,
			},
			data: {
				password,
			},
		});
	}
}
