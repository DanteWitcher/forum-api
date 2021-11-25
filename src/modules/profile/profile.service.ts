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

		await this.checkNickName(profileDto.nickName, profile.email);

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

	async checkNickName(newNickName: string, email: string): Promise<IResponse> {
		const { nickName: oldNickName } = await this.profileRepository.findOne({ where: { email }});
		const profileByNickName = await this.profileRepository.findOne({ where: { nickName: newNickName }});

		if (!profileByNickName || oldNickName === newNickName) {
			return {
				message: `You can use this NickName: ${newNickName}`,
			};
		}
	
		throw new HttpException({
		        message: `NickName ${newNickName} already exist`,
		        errCode: EError.NICKNAME_EXIST,
		    },
		    HttpStatus.BAD_REQUEST,
		)
	}

	async createProfile(user: IUser, profileDto: ProfileDto): Promise<ProfileEntity> {
		await this.checkNickName(profileDto.nickName, user.email);

		const newProfile = await this.profileRepository.create(<ProfileEntity>{
			email: user.email,
			role: user.role,
			nickName: profileDto.nickName,
			firstName: profileDto.firstName,
			middleName: profileDto.middleName,
			lastName: profileDto.lastName,
			phone: profileDto.phone,
			photoUrl: profileDto.photoUrl,
		});

		return this.profileRepository.save(newProfile);
	}

	async getProfile(user: IUser): Promise<ProfileEntity> {
		const profile = await this.profileRepository.findOne({ where: { email: user.email }});

		return profile;
	}

	async getProfiles(take: number = 10, skip: number = 0, keyword: string = ''): Promise<{
	    data: ProfileEntity[],
	    count: number,
	}> {
	    const [result, total] = await this.profileRepository.findAndCount({
	        take: take,
	        skip: skip,
	        where: { nickName: Like('%' + keyword + '%') },
	    });

	    return {
	        data: result,
	        count: total,
	    }
	}
}
