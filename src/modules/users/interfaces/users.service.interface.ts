import { User } from '@prisma/client';
import { USER_ROLE } from '../../../../types/user-role';

export namespace IUserService {
	export interface Register {
		email: string;
		password: string;
		name: string;
	}

	export interface UserCreate {
		email: string;
		password: string;
		name: string;
		roleName: USER_ROLE;
	}

	export interface Login {
		email: string;
		password: string;
	}

	export interface UserService {
		createAdmin: (data: Register) => Promise<User | null>;
		createUser: (data: UserCreate) => Promise<User | null>;
		validateUser: (data: Login) => Promise<boolean>;
		getUserInfo: (email: string) => Promise<User | null>;
		checkRole: (email: string, role: USER_ROLE) => Promise<boolean>;
		setUserPassword: (id: number, password: string) => Promise<User | null>;
		deleteUserPassword: (id: number) => Promise<User | null>;
	}
}
