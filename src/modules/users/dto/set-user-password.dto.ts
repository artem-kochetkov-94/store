import { User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class SetUserPasswordDto {
	@IsNumber({}, { message: 'Пользователь не найден' })
	id: number;

	@IsString({ message: 'Не задан пароль' })
	password: User['password'];
}
