import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dropbox } from 'dropbox';
import { readFile } from 'fs';
import { IResponse } from 'src/share/interfaces/response.interface';

@Injectable()
export class FilesService {
	dropboxPath: string;
	dropbox: Dropbox;

	constructor(private readonly configService: ConfigService) {
		this.dropbox = new Dropbox({
			accessToken: configService.get<string>('DROPBOX_TOKEN'),
		});
		this.dropboxPath = configService.get<string>('DROPBOX_PATH');
	}

	async uploadFile(name: string, contents: Buffer): Promise<IResponse> {
		const path = `${this.dropboxPath}${name}`;

		await this.dropbox.filesUpload({ path, contents});
		const { result } = await this.dropbox.sharingCreateSharedLinkWithSettings({ path });

		return {
			message: `File ${name} was uploaded`,
			data: result?.url,
		}
	}
}
