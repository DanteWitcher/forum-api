import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';

import { IResponse } from 'src/share/interfaces/response.interface';
import { IUser } from 'src/share/interfaces/user.interface';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() authDto: AuthDto): Promise<IResponse> {
    return this.authService.register(authDto.email, authDto.password);
  }

  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res() res: Response,
  ): Promise<Response<IResponse>> {
    return this.authService.login(authDto.email, authDto.password, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-token')
  async getNewToken(
	@Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<IResponse>> {
	const user = <IUser>req.user;

    return this.authService.getNewToken(user.email, res);
  }

  @Get()
  async check(): Promise<string> {
    return 'auth is working... you can use it';
  }
}
