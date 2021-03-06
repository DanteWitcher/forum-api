import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Auth, AuthSchema } from './schemas/auth.schema';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => {
    const signature = configService.get<string>('SIGN');
    const expire = configService.get<string>('EXPIRE');

    return {
      secret: signature,
      signOptions: {
        expiresIn: Number(expire),
      },
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
