import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IRegisterRequestBody } from '../requests/register-local.request';

export class RegisterBodyValidator implements IRegisterRequestBody {
  @ApiProperty({
    example: 'Zulfikar',
    description: 'Insert your first name in Here!',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Isnaen',
    description: 'Insert your last name in Here!',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '+62870123453',
    description: 'Insert your phone number in Here!',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: 'isnaen@gmail.com',
    description: 'Insert your email in Here!',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'zul123456',
    description: 'Insert your password in Here!',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'zul123456',
    description:
      'Insert your confirm password in Here!, make sure same as a password',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  confirmPassword: string;
}

export default class RegisterValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => RegisterBodyValidator)
  body: RegisterBodyValidator;
}
