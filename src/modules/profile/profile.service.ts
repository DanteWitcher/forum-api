import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { EError } from 'src/share/enums/error.enum';
import { IUser } from 'src/share/interfaces/user.interface';
import { ProfileDto } from './dto/profile.dto';
import { ProfileEntity } from './model/profile.entity';
import { IResponse } from 'src/share/interfaces/response.interface';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity) private readonly profileRepository: Repository<ProfileEntity>,
	) {}

	async deleteProfile(profileDto: ProfileDto): Promise<IResponse> {
		await this.profileRepository.delete({ id: profileDto.id });

		return {
			message: `Profile has deleted`,
		};
	}

	async updateProfile(profileDto: ProfileDto): Promise<ProfileEntity> {
		const profile = await this.profileRepository.findOne({ where: { id: profileDto.id }});

		if (!profile) {
		    throw new HttpException({
		            message: `Profile is not created`,
		            errCode: EError.PROFILE_NOT_CREATED,
		        },
		        HttpStatus.BAD_REQUEST,
		    )
		}

		await this.checkNickName(profileDto.nickName);

		const newProfile = {
			...profileDto,
			id: profile.id,
			email: profile.email,
			role: profile.role,
			createDateTime: profile.createDateTime,
			lastChangedDateTime: () => 'CURRENT_TIMESTAMP',
		};

		await this.profileRepository.update(profile.id, newProfile);

		return this.profileRepository.findOne(newProfile.id);
	}

	async checkNickName(nickName: string): Promise<IResponse> {
		const profile = await this.profileRepository.findOne({ where: { nickName }});

		if (!profile) {
			return {
				message: `You can use this NickName: ${nickName}`,
			};
		}
	
		throw new HttpException({
		        message: `NickName ${nickName} already exist`,
		        errCode: EError.NICKNAME_EXIST,
		    },
		    HttpStatus.BAD_REQUEST,
		)
	}

	async createProfile(user: IUser, profileDto: ProfileDto): Promise<ProfileEntity> {
		await this.checkNickName(profileDto.nickName);

		const newProfile = await this.profileRepository.create(<ProfileEntity>{
			email: user.email,
			role: user.role,
			...profileDto,
		});

		return this.profileRepository.save(newProfile);
	}

	async getProfile(user: IUser): Promise<ProfileEntity> {
		const profile = await this.profileRepository.findOne({ where: { email: user.email }});

		if (!profile) {
			throw new HttpException({
			        message: `Profile for '${user.email}' is not created`,
			        errCode: EError.PROFILE_NOT_CREATED,
			    },
			    HttpStatus.BAD_REQUEST,
			);
		}

		return profile;
	}

	async getProfiles(take: number = 10, skip: number = 0, keyword: string = ''): Promise<{
	    data: ProfileEntity[],
	    count: number,
	}> {
	    const [result, total] = await this.profileRepository.findAndCount({
	        take: take,
	        skip: skip,
	        where: { name: Like('%' + keyword + '%') },
	    });

	    return {
	        data: result,
	        count: total,
	    }
	}
}