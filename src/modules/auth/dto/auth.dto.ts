import { IsEmail } from 'class-validator';
import { AUTH_CONFIG } from '../config';
import { IsPassword } from '../validators/isPassword.validator';

export class AuthDto {
  @IsEmail()
  readonly email: string;

  @IsPassword(AUTH_CONFIG.REGEX_PASSWORD)
  readonly password: string;
}
