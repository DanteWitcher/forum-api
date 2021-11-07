import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EError } from 'src/share/enums/error.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<IUser>(err, user: IUser, info): IUser {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        message: `Token was expired`,
        errCode: EError.EXPIRED_TOKEN,
      });
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
