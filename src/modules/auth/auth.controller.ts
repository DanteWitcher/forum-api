import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    async register(@Body() AuthDto: AuthDto) {
    }

    //   @Post('/login')
    //   async login(@Body() createCatDto: CreateCatDto) {

    //   }

    @Get()
    async check(): Promise<string> {
        return 'auth is working... you can use it';
    }
}