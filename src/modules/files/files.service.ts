import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dropbox } from 'dropbox';
import { EError } from 'src/share/enums/error.enum';
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

	async uploadProfilePhoto(name: string, contents: Buffer): Promise<IResponse> {
		try {
			const randomValue = Math.floor(1000 * Math.random());
			const path = `${this.dropboxPath}${randomValue}-${name}`;
			await this.dropbox.filesUpload({ path, contents});
			const { result } = await this.dropbox.sharingCreateSharedLinkWithSettings({ path });

			return {
				message: `File ${name} was uploaded`,
				data: result?.url,
			}
		} catch(err) {
			const { error } = err;

			throw new HttpException({
			        message: error?.error_summary,
					errCode: EError.DROPBOX_ERR,
			    },
			    err.status,
			);
		}
	}
}
