import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AuthModule } from './modules/auth/auth.module';
import { AUTH_CONFIG } from './modules/auth/config';
import { ProfileModule } from './modules/profile/profile.module';

const modules = [AuthModule, ProfileModule];

const authConfig = registerAs('authConfig', () => AUTH_CONFIG);

const configSetup = {
  load: [authConfig],
  isGlobal: true,
  envFilePath: ['./envs/.env.dev', './envs/.env.prod'],
};

const mongooseFactory = {
  useFactory: async (configService: ConfigService) => {
    const mongodbUri = configService.get<string>('MONGODB_URI');

    return { uri: mongodbUri };
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ...modules,
    ConfigModule.forRoot(configSetup),
    MongooseModule.forRootAsync(mongooseFactory),
  ],
})
export class AppModule {}
