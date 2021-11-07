import { IsString, IsNotEmpty, IsPhoneNumber, IsUrl, IsOptional, IsUUID } from 'class-validator';

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
  @IsOptional()
  readonly phone: string;

  @IsUrl()
  @IsOptional()
  readonly photoUrl: string;
}
