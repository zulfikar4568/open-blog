import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, ValidateNested } from 'class-validator';
import { IDeleteTagRequestParams } from '../requests/delete-tag.request';

export class DeleteTagParamsValidator implements IDeleteTagRequestParams {
  @ApiProperty({
    example: '12',
    description: 'Insert your tag id in Here!',
  })
  @IsInt()
  id: number;
}

export default class DeleteTagValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => DeleteTagParamsValidator)
  params: DeleteTagParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
