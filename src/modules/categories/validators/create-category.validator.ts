import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ICreateCategoryRequestBody } from '../requests/create-category.request';

export class CreateCategoryBodyValidator implements ICreateCategoryRequestBody {
  @ApiProperty({
    example: 'Technology',
    description: 'Insert your category name in Here!',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This is Technology Tag',
    description: 'Insert your category description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export default class CreateCategoryValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => CreateCategoryBodyValidator)
  body: CreateCategoryBodyValidator;
}
