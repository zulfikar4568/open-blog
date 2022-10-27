import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { ILoginLocalRequestBody } from '../requests/login-local.request';

export class LoginLocalBodyValidator implements ILoginLocalRequestBody {
  @ApiProperty({
    example: 'isnaen@gmail.com',
    description: 'Insert your email in Here!',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Insert your Password in Here!',
  })
  @IsString()
  password: string;
}

export default class LoginLocalValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => LoginLocalBodyValidator)
  body: LoginLocalBodyValidator;
}
