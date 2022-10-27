import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ICreateTagRequestBody } from '../requests/create-tag.request';

export class CreateTagBodyValidator implements ICreateTagRequestBody {
  @ApiProperty({
    example: 'Engineering',
    description: 'Insert your tag name in Here!',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This is Engineering Tag',
    description: 'Insert your tag description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export default class CreateTagValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => CreateTagBodyValidator)
  body: CreateTagBodyValidator;
}
