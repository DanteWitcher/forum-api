import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./envs/.env.dev', './envs/.env.prod'],
    }),
    MongooseModule.forRoot('mongodb://localhost/auth'),
  ],
})
export class AppModule {}
