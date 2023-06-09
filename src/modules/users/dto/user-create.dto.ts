import { IsEmail, IsString } from 'class-validator';
import { USER_ROLE } from '../../../../types/user-role';

export class UserCreateDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;

	@IsString({ message: 'Не задана роль' })
	roleName: USER_ROLE;
}
