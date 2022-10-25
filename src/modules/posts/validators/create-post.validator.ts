import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ICreatePostRequestBody } from '../requests/create-post.request';

export class CreatePostBodyValidator implements ICreatePostRequestBody {
  @ApiProperty({
    example: 'Welcome to the post',
    description: 'Insert your title post in Here!',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'https://miro.medium.com/max/1400/1*X6wCDTpjcn_WcvDW9jS4WQ.png',
    description: 'Image cover for this post!',
  })
  @IsString()
  @IsOptional()
  imageCover: string | null;

  @ApiProperty({
    example: 'This is the end of post',
    description: 'Summary of your post',
  })
  @IsString()
  @IsOptional()
  summary: string | null;

  @ApiProperty({
    example: '<h1>This is my content</h1>',
    description: 'Put the content here!',
  })
  @IsString()
  @IsOptional()
  postContents: string | null;

  @ApiProperty({
    example: true,
    description: 'Is published or not!',
  })
  @IsBoolean()
  @IsOptional()
  isPublished: boolean | null;

  @ApiProperty({
    example: [2, 3],
    description: 'You can attach categories into this post!',
  })
  @IsArray()
  categories: number[];

  @ApiProperty({
    example: [1, 5],
    description: 'You can attach tags into this post!',
  })
  @IsArray()
  tags: number[];
}

export default class CreatePostValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => CreatePostBodyValidator)
  body: CreatePostBodyValidator;
}
