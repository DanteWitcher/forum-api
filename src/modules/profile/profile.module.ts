import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ProfileEntity } from './model/profile.entity';


const postgresConfig = {
    useFactory: async (configService: ConfigService) => {
        return <PostgresConnectionOptions>{
			type: 'postgres',

            host: configService.get<string>('POSTGRES_HOST'),
            port: parseInt(configService.get<string>('POSTGRES_PORT')),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DATABASE'),
			autoLoadEntities: true,
			synchronize: true,
			// TODO: check it 
			// entities: ['**/*.entity{.ts,.js}'],

			// migrationsTableName: 'migration',

			// migrations: ['src/migration/*.ts'],
			// cli: { migrationsDir: 'src/migration' },
			// ssl: false,
        };
    },
    inject: [ConfigService],
}

@Module({
	imports: [
		TypeOrmModule.forRootAsync(postgresConfig),
		TypeOrmModule.forFeature([ProfileEntity]),
	],
	providers: [ProfileService],
	controllers: [ProfileController],
})
export class ProfileModule {}
