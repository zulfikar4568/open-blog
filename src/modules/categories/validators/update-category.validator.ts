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
  IUpdateCategoryRequestBody,
  IUpdateCategoryRequestParams,
} from '../requests/update-category.requet';

export class UpdateCategoryBodyValidator implements IUpdateCategoryRequestBody {
  @ApiProperty({
    example: 'Technology',
    description: 'Insert your category name in Here!',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'This is Technology Category',
    description: 'Insert your category description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryParamsValidator
  implements IUpdateCategoryRequestParams
{
  @ApiProperty({
    example: 12,
    description: 'Insert your category id in Here!',
  })
  @IsInt()
  id: number;
}

export default class UpdateCategoryValidator {
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateCategoryParamsValidator)
  params: UpdateCategoryParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => UpdateCategoryBodyValidator)
  body: UpdateCategoryBodyValidator;
}
