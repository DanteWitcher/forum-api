import { Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";
import { IResponse } from "src/share/interfaces/response.interface";
import { FilesService } from "./files.service";

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@UseGuards(JwtAuthGuard)
	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<IResponse> {
		return this.filesService.uploadFile(file.originalname, file.buffer);
	}

	@Get('check')
	async check() {
		return 'files service is working';
	}
}