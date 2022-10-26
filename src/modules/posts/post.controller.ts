import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import GetPostResponse from './serializers/get-post.response';
import { GetPostParamsValidator } from './validators/get-post.validator';
import { CreatePostBodyValidator } from './validators/create-post.validator';
import CreatePostResponse from './serializers/create-post.response';
import UpdatePostResponse from './serializers/update-post.response';
import {
  UpdatePostBodyValidator,
  UpdatePostParamsValidator,
} from './validators/update-post.validator';
import DeletePostResponse from './serializers/delete-post.response';
import { DeletePostParamsValidator } from './validators/delete-post.validator';
import ListPostResponse from './serializers/list-post.request';
import { ListPostQueryValidator } from './validators/list-post.validator';
import SuccessResponse from '@/shared/responses/success.response';
import Serializer from '@/shared/decorators/serializer.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import UseList from '@/shared/decorators/uselist.decorator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Serializer(ListPostResponse)
  @UseList()
  @ApiFilterQuery('filters', ListPostQueryValidator)
  public async lists(@Context() ctx: IContext) {
    const { meta, result } = await this.postService.listPosts(ctx);

    return new SuccessResponse('post fetched successfully', result, meta);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Serializer(GetPostResponse)
  public async getPostById(
    @Param() params: GetPostParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.postService.getPostById(params);

    return new SuccessResponse('post fetched successfully', result);
  }

  @ApiBearerAuth('access-token')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreatePostResponse)
  @Authentication(true)
  public async createPost(
    @Body() body: CreatePostBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.postService.createPost(body);

    return new SuccessResponse('post created successfully', result);
  }

  @ApiBearerAuth('access-token')
  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(UpdatePostResponse)
  @Authentication(true)
  public async updatePost(
    @Param() params: UpdatePostParamsValidator,
    @Body() body: UpdatePostBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.postService.updatePost(params, body);

    return new SuccessResponse('post fetched successfully', result);
  }

  @ApiBearerAuth('access-token')
  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(DeletePostResponse)
  @Authentication(true)
  public async deletePost(
    @Param() params: DeletePostParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.postService.deletePost(params);

    return new SuccessResponse('post deleted successfully', result);
  }
}
