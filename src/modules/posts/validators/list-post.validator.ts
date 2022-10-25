import { Post, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { TListPostRequestQuery } from '../requests/list-post.request';
import {
  BaseQueryValidator,
  OperatorQuery,
} from '@/shared/types/query-cursor.type';

class ListPostQueryField implements Prisma.PostWhereInput {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  id?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  @ApiPropertyOptional({ type: OperatorQuery })
  title?: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  imageCover?: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  summary?: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  postContents?: string;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  lastRead?: Date;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  counterLike?: number;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  isPublished?: boolean;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  createdAt?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  updatedAt?: OperatorQuery;
}

export class ListPostQueryValidator extends BaseQueryValidator<Post> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPostQueryField)
  @ApiPropertyOptional({ type: ListPostQueryField })
  field?: ListPostQueryField;
}

class FilterPostQueryValidator implements TListPostRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPostQueryValidator)
  filters: ListPostQueryValidator;
}

export default class ListPostValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterPostQueryValidator)
  query: FilterPostQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
