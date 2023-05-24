import { User } from '@prisma/client';
import { USER_ROLE } from '../../../../types/user-role';

export namespace IUsersRepository {
	export interface CreateUser {
		email: string;
		password: string;
		name: string;
		roleName: USER_ROLE;
	}

	export interface UsersRepository {
		findByEmail: (email: string) => Promise<User | null>;
		findById: (id: number) => Promise<User | null>;
		createUser: (data: CreateUser) => Promise<User>;
		checkRole: (email: string, roleName: USER_ROLE) => Promise<User | null>;
		deleteUserPassword: (id: number) => Promise<User | null>;
		setUserPassword: (id: number, password: string) => Promise<User | null>;
	}
}
