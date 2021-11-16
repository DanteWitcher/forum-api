import { IsString, IsNotEmpty, IsPhoneNumber, IsUrl, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class ProfileDto {
  @IsUUID()
  @IsOptional()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly nickName: string;

  @IsString()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly middleName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsPhoneNumber()
  @ValidateIf((req: ProfileDto) => req.phone !== '') 
  @IsOptional()
  readonly phone: string;

  @IsUrl()
  @ValidateIf((req: ProfileDto) => req.photoUrl !== '') 
  @IsOptional()
  readonly photoUrl: string;
}
