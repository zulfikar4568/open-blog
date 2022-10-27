import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IUpdateTagRequestBody,
  IUpdateTagRequestParams,
} from '../requests/update-tag.request';

export class UpdateTagBodyValidator implements IUpdateTagRequestBody {
  @ApiProperty({
    example: 'Engineering',
    description: 'Insert your tag name in Here!',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'This is Engineering Tag',
    description: 'Insert your tag description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTagParamsValidator implements IUpdateTagRequestParams {
  @ApiProperty({
    example: '12',
    description: 'Insert your tag id in Here!',
  })
  @IsInt()
  id: number;
}

export default class UpdateTagValidator {
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateTagParamsValidator)
  params: UpdateTagParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => UpdateTagBodyValidator)
  body: UpdateTagBodyValidator;
}
