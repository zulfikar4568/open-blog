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
import { ApiTags } from '@nestjs/swagger';
import CreateTagResponse from './serializers/create-tag.response';
import DeleteTagResponse from './serializers/delete-tag.response';
import GetTagResponse from './serializers/get-tag.response';
import UpdateTagResponse from './serializers/update-tag.response';
import { TagService } from './tag.service';
import { CreateTagBodyValidator } from './validators/create-tag.validator';
import { DeleteTagParamsValidator } from './validators/delete-tag.validator';
import { GetTagParamsValidator } from './validators/get-tag.validator';
import {
  UpdateTagBodyValidator,
  UpdateTagParamsValidator,
} from './validators/update-tag.validator';
import SuccessResponse from '@/shared/responses/success.response';
import Serializer from '@/shared/decorators/serializer.decorator';

@ApiTags('Tag')
@Controller('tags')
export default class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Serializer(GetTagResponse)
  public async getAllTags(): Promise<SuccessResponse> {
    const result = await this.tagService.getAllTags();

    return new SuccessResponse('All tags listed successfully!', result);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Serializer(GetTagResponse)
  public async getTagById(
    @Param() params: GetTagParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.tagService.getTagById(params);

    return new SuccessResponse('tag fetched successfully', result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreateTagResponse)
  public async createTag(
    @Body() body: CreateTagBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.tagService.createTag(body);

    return new SuccessResponse('tag created successfully', result);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(UpdateTagResponse)
  public async updateTag(
    @Param() params: UpdateTagParamsValidator,
    @Body() body: UpdateTagBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.tagService.updateTag(params, body);

    return new SuccessResponse('tag fetched successfully', result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(DeleteTagResponse)
  public async deleteTag(
    @Param() params: DeleteTagParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.tagService.deleteTag(params);

    return new SuccessResponse('tag deleted successfully', result);
  }
}
