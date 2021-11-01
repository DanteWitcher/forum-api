import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { IResponse } from 'src/share/interfaces/response.interface';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() authDto: AuthDto): Promise<IResponse> {
    return this.authService.register(authDto.email, authDto.password);
  }

  @Post('/login')
  async login(@Body() authDto: AuthDto, @Res() res: Response): Promise<IResponse> {
    return this.authService.login(authDto.email, authDto.password, res);
  }

  @Get()
  async check(): Promise<string> {
    return 'auth is working... you can use it';
  }
}
