import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request } from "express";

import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";
import { AdminGuard } from "src/share/guards/admin.guard";
import { IResponse } from "src/share/interfaces/response.interface";
import { IUser } from "src/share/interfaces/user.interface";
import { ProfileDto } from "./dto/profile.dto";
import { ProfileEntity } from "./model/profile.entity";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@UseGuards(JwtAuthGuard)
	@Post('check-name')
	checkNickName(
		@Param() nickName: string,
	) {
		return this.profileService.checkNickName(nickName);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('update')
	editProfile(
		@Body() profileDto: ProfileDto,
	) {
		return this.profileService.updateProfile(profileDto);
	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	createProfile(
		@Req() req: Request,
		@Body() profileDto: ProfileDto,
	): Promise<ProfileEntity> {
		const user = <IUser>req.user;

		return this.profileService.createProfile(user, profileDto);
	}

	@UseGuards(AdminGuard)
	@UseGuards(JwtAuthGuard)
	@Delete('delete')
	deleteProfile(@Body() profileDto: ProfileDto): Promise<IResponse> {
		return this.profileService.deleteProfile(profileDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	getProfile(@Req() req: Request): Promise<ProfileEntity> {
		const user = <IUser>req.user;

		return this.profileService.getProfile(user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profiles')
	getProfiles(@Query() { take, skip }): Promise<{
		data: ProfileEntity[],
		count: number,
	}> {
		return this.profileService.getProfiles(take, skip);
	}

	@Get('check')
	check() {
		return 'profile service is working';
	}
}