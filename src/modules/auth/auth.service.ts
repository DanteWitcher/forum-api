import {
  HttpException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hash, verify } from 'argon2';
import { Response } from 'express';
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
    private readonly configService: ConfigService,
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

  async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<Response<IResponse>> {
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

    return this.generateToken(foundUser, res);
  }

  async getNewToken(
	email: string,
    res: Response,
  ): Promise<Response<IResponse>> {
    const foundUser = await this.authModel.findOne({ email });

    if (!foundUser) {
      throw new UnauthorizedException({
        message: `User with email: '${email}', hasn't registered`,
        errCode: EError.USER_NOT_REGISTERED,
      });
    }

    return this.generateToken(foundUser, res);
  }

  private generateToken(
    user: AuthDocument,
    res: Response,
  ): Response<IResponse> {
    const payload = { email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const expire = this.configService.get<number>('EXPIRE');

    res.cookie('access_token', accessToken, {
      expires: new Date(new Date().getTime() + expire * 1000),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.json({
      message: `User with email: '${user.email}' has logged successfully`,
      access_token: accessToken,
    });
  }
}
