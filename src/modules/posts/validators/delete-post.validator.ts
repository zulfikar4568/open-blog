import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, ValidateNested } from 'class-validator';
import { IDeletePostRequestParams } from '../requests/delete-post.request';

export class DeletePostParamsValidator implements IDeletePostRequestParams {
  @ApiProperty({
    example: 12,
    description: 'Insert your post id in Here!',
  })
  @IsInt()
  id: number;
}

export default class DeletePostValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => DeletePostParamsValidator)
  params: DeletePostParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
