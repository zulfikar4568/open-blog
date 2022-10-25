import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IUpdatePostRequestBody,
  IUpdatePostRequestParams,
} from '../requests/update-post.request';

export class UpdatePostBodyValidator implements IUpdatePostRequestBody {
  @ApiProperty({
    example: 'Welcome to the post',
    description: 'Insert your title post in Here!',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'https://miro.medium.com/max/1400/1*X6wCDTpjcn_WcvDW9jS4WQ.png',
    description: 'Image cover for this post!',
  })
  @IsString()
  @IsOptional()
  imageCover?: string;

  @ApiProperty({
    example: 'This is the end of post',
    description: 'Summary of your post',
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    example: '<h1>This is my content</h1>',
    description: 'Put the content here!',
  })
  @IsString()
  @IsOptional()
  postContents?: string;

  @ApiProperty({
    example: '2022-12-25T14:18:53.638Z',
    description: 'Put the last date here!',
  })
  @IsDateString()
  @IsOptional()
  lastRead?: Date;

  @ApiProperty({
    example: 12,
    description: 'Put the Counter Like here!',
  })
  @IsInt()
  @IsOptional()
  counterLike?: number;

  @ApiProperty({
    example: true,
    description: 'Is published or not!',
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({
    example: [2, 3],
    description: 'You can attach categories into this post!',
  })
  @IsArray()
  @IsOptional()
  categories: number[];

  @ApiProperty({
    example: [1, 5],
    description: 'You can attach tags into this post!',
  })
  @IsArray()
  @IsOptional()
  tags: number[];
}

export class UpdatePostParamsValidator implements IUpdatePostRequestParams {
  @ApiProperty({
    example: 12,
    description: 'Insert your post id in Here!',
  })
  @IsInt()
  id: number;
}

export default class UpdatePostValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => UpdatePostParamsValidator)
  params: UpdatePostParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => UpdatePostBodyValidator)
  body: UpdatePostBodyValidator;
}
