import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, ValidateNested } from 'class-validator';
import { IDeleteCategoryRequestParams } from '../requests/delete-category.request';

export class DeleteCategoryParamsValidator
  implements IDeleteCategoryRequestParams
{
  @ApiProperty({
    example: 12,
    description: 'Insert your category id in Here!',
  })
  @IsInt()
  id: number;
}

export default class DeleteCategoryValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => DeleteCategoryParamsValidator)
  params: DeleteCategoryParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
