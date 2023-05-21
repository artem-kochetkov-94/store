import { Role, User } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { SetUserPasswordDto } from './dto/set-user-password.dto';

export interface IUserService {
	createAdmin: (dto: UserRegisterDto) => Promise<User | null>;
	createUser: (dto: UserCreateDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<User | null>;
	checkRole: (email: string, role: Role['name']) => Promise<boolean>;
	setUserPassword: (dto: SetUserPasswordDto) => Promise<User | null>;
	deleteUserPassword: (id: User['id']) => Promise<User | null>;
}
