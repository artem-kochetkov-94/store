import { User } from '.prisma/client';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../types';
import { USER_ROLE } from '../../../types/user-role';
import { IConfigService } from '../../config/config.service.interface';

import { UserEntity } from './user.entity';

import { IUserService, IUsersRepository } from './interfaces';

@injectable()
export class UserService implements IUserService.UserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository.UsersRepository,
	) {}

	async createAdmin(body: IUserService.Register): Promise<User | null> {
		return this.createUser({ ...body, roleName: USER_ROLE.ADMIN });
	}

	async createUser({
		email,
		name,
		password,
		roleName,
	}: IUserService.UserCreate): Promise<User | null> {
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');

		await newUser.setPassword(password, Number(salt));
		newUser.setRoleName(roleName);

		const existedUser = await this.usersRepository.findByEmail(email);

		if (existedUser) {
			return null;
		}

		return this.usersRepository.createUser(newUser);
	}

	async validateUser({ email, password }: IUserService.Login): Promise<boolean> {
		const existedUser = await this.usersRepository.findByEmail(email);

		if (!existedUser) {
			return false;
		}

		const newUser = new UserEntity(existedUser.email, existedUser.name);
		newUser.setPasswordHash(existedUser.password);
		return newUser.comparePassword(password);
	}

	async checkRole(email: string, roleName: USER_ROLE): Promise<boolean> {
		const existedUser = await this.usersRepository.checkRole(email, roleName);

		if (!existedUser) {
			return false;
		}

		return true;
	}

	async getUserInfo(email: string): Promise<User | null> {
		return this.usersRepository.findByEmail(email);
	}

	async setUserPassword(id: number, password: string): Promise<User | null> {
		const existedUser = await this.usersRepository.findById(id);

		if (!existedUser) {
			return null;
		}

		const newUser = new UserEntity(existedUser.email, existedUser.name);
		const salt = this.configService.get('SALT');

		await newUser.setPassword(password, Number(salt));

		return this.usersRepository.setUserPassword(id, newUser.password);
	}

	async deleteUserPassword(id: number): Promise<User | null> {
		if (!(await this.usersRepository.findById(id))) {
			return null;
		}

		return this.usersRepository.deleteUserPassword(id);
	}
}
