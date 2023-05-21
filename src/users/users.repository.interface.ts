import { Role, User } from '@prisma/client';
import { UserEntity } from './user.entity';
import { SetUserPasswordDto } from './dto/set-user-password.dto';

export interface IUsersRepository {
	createUser: ({ email, password, name }: UserEntity) => Promise<User>;
	findByEmail: (email: string) => Promise<User | null>;
	findById: (id: User['id']) => Promise<User | null>;
	checkRole: (email: string, roleName: Role['name']) => Promise<User | null>;
	deleteUserPassword: (id: User['id']) => Promise<User | null>;
	setUserPassword: (dto: SetUserPasswordDto) => Promise<User | null>;
}
