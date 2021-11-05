import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';


const postgresConfig = {
    useFactory: async (configService: ConfigService) => {
        return {
			type: 'postgres',

            host: configService.get<string>('POSTGRES_HOST'),
            port: parseInt(configService.get<string>('POSTGRES_PORT')),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DATABASE'),

			entities: ['**/*.entity{.ts,.js}'],

			migrationsTableName: 'migration',

			migrations: ['src/migration/*.ts'],

			cli: {
				migrationsDir: 'src/migration',
			},

			ssl: this.isProduction(),
        };
    },
    inject: [ConfigService],
}

@Module({
	imports: [TypeOrmModule.forRootAsync(postgresConfig)],
	providers: [ProfileService],
	controllers: [ProfileController],
})
export class ProfileModule {}
