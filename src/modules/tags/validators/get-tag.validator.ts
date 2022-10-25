import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, ValidateNested } from 'class-validator';
import { IGetTagRequestParams } from '../requests/get-tag.request';

export class GetTagParamsValidator implements IGetTagRequestParams {
  @ApiProperty({
    example: '12',
    description: 'Insert your tag id in Here!',
  })
  @IsInt()
  id: number;
}

export default class GetTagValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => GetTagParamsValidator)
  params: GetTagParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
