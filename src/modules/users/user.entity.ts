import { compare, hash } from 'bcryptjs';
import { USER_ROLE } from '../../../types/user-role';

export class UserEntity {
	private _password: string;

	constructor(
		private readonly _email: string,
		private readonly _name: string,
		private readonly _roleName?: USER_ROLE,
	) {}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	get roleName(): USER_ROLE | void {
		return this._roleName;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public setPasswordHash(pass: string): void {
		this._password = pass;
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return compare(pass, this._password);
	}
}
