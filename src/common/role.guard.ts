import { Role } from '@prisma/client';
import { IUserService } from '../users/users.service.interface';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class RoleGuard implements IMiddleware {
	constructor(private roleName: Role['name'], private userService: IUserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		const haveAccess = await this.userService.checkRole(req.user, this.roleName);
		return next();
		if (haveAccess) {
			return next();
		}

		res.status(403).send({ error: 'Доступ запрещен' });
	}
}
