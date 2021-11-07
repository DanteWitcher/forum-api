import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ERole } from '../enums/role.enum';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
	const user: IUser = context.switchToHttp().getRequest()?.user;

	if (!user) {
		return false;
	}

    return user.role === ERole.ADMIN;
  }
}
