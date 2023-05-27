import { User } from '.prisma/client';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../types';
import { USER_ROLE } from '../../../types/user-role';

import { PrismaService } from '../../database/prisma.service';

import { IUsersRepository } from './interfaces';

@injectable()
export class UsersRepository implements IUsersRepository.UsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async findByEmail(email: string): Promise<User | null> {
		return this.prismaService.client.user.findFirst({
			where: {
				email,
			},
		});
	}

	async findById(id: number): Promise<User | null> {
		return this.prismaService.client.user.findFirst({
			where: {
				id,
			},
		});
	}

	async checkRole(email: string, roleName: USER_ROLE): Promise<User | null> {
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

	async createUser({
		email,
		password,
		name,
		roleName,
	}: IUsersRepository.CreateUser): Promise<User> {
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

	async deleteUserPassword(id: number): Promise<User | null> {
		return this.prismaService.client.user.update({
			where: {
				id,
			},
			data: {
				password: '',
			},
		});
	}

	async setUserPassword(id: number, password: string): Promise<User | null> {
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
