import { Module } from '@nestjs/common';
import { ProfileService } from './profile/profile.service';

@Module({
  providers: [ProfileService],
})
export class ProfileModule {}
