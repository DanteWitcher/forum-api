import {
  HttpException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hash, verify } from 'argon2';

import { Model } from 'mongoose';
import { EError } from 'src/share/enums/error.enum';
import { ERole } from 'src/share/enums/role.enum';
import { IResponse } from 'src/share/interfaces/response.interface';
import { Auth, AuthDocument } from './schemas/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<IResponse> {
    const foundUser = await this.authModel.findOne({ email });

    if (foundUser) {
      throw new HttpException(
        {
          message: `User with email: '${email}' already exist`,
          errCode: EError.EMAIL_ALREADY_EXIST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await hash(password);

    await this.authModel.create({
      email,
      password: passwordHash,
      role: ERole.USER,
    });

    return {
      message: `User with email: '${email}' has registered successfully`,
    };
  }

  async login(email: string, password: string): Promise<IResponse> {
    const foundUser = await this.authModel.findOne({ email });

    if (!foundUser) {
      throw new UnauthorizedException({
        message: `User with email: '${email}', hasn't registered`,
        errCode: EError.USER_NOT_REGISTERED,
      });
    }

    const correctPassword = await verify(foundUser.password, password);

    if (!correctPassword) {
      throw new HttpException(
        {
          message: `User with email: '${email}' has other password`,
          errCode: EError.INCORRECT_PASSWORD,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { email: foundUser.email, role: foundUser.role };

    return {
      message: `User with email: '${email}' has logged successfully`,
      access_token: this.jwtService.sign(payload),
    };
  }
}
