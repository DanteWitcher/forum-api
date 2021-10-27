import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
	  AuthModule,
      MongooseModule.forRoot('mongodb://localhost/tokens'),
  ],
})
export class AppModule {}
