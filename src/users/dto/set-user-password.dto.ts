import { User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class SetUserPasswordDto {
	@IsNumber({}, { message: 'Пользователь не найден' })
	id: User['id'];

	@IsString({ message: 'Не задан пароль' })
	password: User['password'];
}
