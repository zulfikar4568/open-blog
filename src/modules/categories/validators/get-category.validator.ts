import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, ValidateNested } from 'class-validator';
import { IGetCategoryRequestParams } from '../requests/get-category.request';

export class GetCategoryParamsValidator implements IGetCategoryRequestParams {
  @ApiProperty({
    example: 12,
    description: 'Insert your category id in Here!',
  })
  @IsInt()
  id: number;
}

export default class GetCategoryValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => GetCategoryParamsValidator)
  params: GetCategoryParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
