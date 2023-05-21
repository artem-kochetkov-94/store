import { User } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { Role } from '@prisma/client';
import { UserCreateDto } from './dto/user-create.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { USER_ROLE } from '../../../types/user-role';
import { SetUserPasswordDto } from './dto/set-user-password.dto';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createAdmin(body: UserRegisterDto): Promise<User | null> {
		return this.createUser({ ...body, roleName: USER_ROLE.ADMIN });
	}

	async createUser({ email, name, password, roleName }: UserCreateDto): Promise<User | null> {
		const newUser = new UserEntity(email, name, roleName);
		const salt = this.configService.get('SALT');

		await newUser.setPassword(password, Number(salt));

		const existedUser = await this.usersRepository.findByEmail(email);

		if (existedUser) {
			return null;
		}

		return this.usersRepository.createUser(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.findByEmail(email);

		if (!existedUser) {
			return false;
		}

		const newUser = new UserEntity(existedUser.email, existedUser.name);
		newUser.setPasswordHash(existedUser.password);
		return newUser.comparePassword(password);
	}

	async checkRole(email: string, roleName: Role['name']): Promise<boolean> {
		const existedUser = await this.usersRepository.checkRole(email, roleName);

		if (!existedUser) {
			return false;
		}

		return true;
	}

	async getUserInfo(email: string): Promise<User | null> {
		return this.usersRepository.findByEmail(email);
	}

	async setUserPassword(body: SetUserPasswordDto): Promise<User | null> {
		const existedUser = await this.usersRepository.findById(body.id);

		if (!existedUser || body.id) {
			return null;
		}

		const newUser = new UserEntity(existedUser.email, existedUser.name);
		const salt = this.configService.get('SALT');

		await newUser.setPassword(body.password, Number(salt));

		return this.usersRepository.setUserPassword({
			...body,
			password: newUser.password,
		});
	}

	async deleteUserPassword(id: User['id']): Promise<User | null> {
		if (!(await this.usersRepository.findById(id))) {
			return null;
		}

		return this.usersRepository.deleteUserPassword(id);
	}
}
