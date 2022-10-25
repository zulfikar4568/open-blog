import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, ValidateNested } from 'class-validator';
import { IGetPostRequestParams } from '../requests/get-post.request';

export class GetPostParamsValidator implements IGetPostRequestParams {
  @ApiProperty({
    example: 12,
    description: 'Insert your post id in Here!',
  })
  @IsInt()
  id: number;
}

export default class GetPostValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => GetPostParamsValidator)
  params: GetPostParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
