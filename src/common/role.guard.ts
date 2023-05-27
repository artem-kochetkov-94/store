import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../modules/users/interfaces';
import { USER_ROLE } from '../../types/user-role';

export class RoleGuard implements IMiddleware {
	constructor(private roleName: USER_ROLE, private userService: IUserService.UserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		const haveAccess = await this.userService.checkRole(req.user, this.roleName);

		if (haveAccess) {
			return next();
		}

		res.status(403).send({ error: 'Доступ запрещен' });
	}
}
