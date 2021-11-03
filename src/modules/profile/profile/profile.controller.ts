import { Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {

	}

	@UseGuards(JwtAuthGuard)
	@Patch('edit')
	editProfile() {

	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	createProfile() {

	}

	@UseGuards(JwtAuthGuard)
	@Delete('delete')
	deleteProfile() {

	}

	@UseGuards(JwtAuthGuard)
	@Get()
	getProfile() {
		return 'profile service is working';
	}

	@Get('check')
	check() {
		return 'profile service is working';
	}
}