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
import { CategoryService } from './category.service';
import CreateCategoryResponse from './serializers/create-category.response';
import DeleteCategoryResponse from './serializers/delete-category.response';
import GetCategoryResponse from './serializers/get-category.response';
import UpdateCategoryResponse from './serializers/update-category.response';
import { CreateCategoryBodyValidator } from './validators/create-category.validator';
import { DeleteCategoryParamsValidator } from './validators/delete-category.validator';
import { GetCategoryParamsValidator } from './validators/get-category.validator';
import {
  UpdateCategoryBodyValidator,
  UpdateCategoryParamsValidator,
} from './validators/update-category.validator';
import SuccessResponse from '@/shared/responses/success.response';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';

@ApiTags('Category')
@Controller('categories')
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Serializer(GetCategoryResponse)
  public async getAllCategories(): Promise<SuccessResponse> {
    const result = await this.categoryService.getAllCategories();

    return new SuccessResponse('All categories listed successfully!', result);
  }

  @ApiBearerAuth('access-token')
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Serializer(GetCategoryResponse)
  public async getCategoryById(
    @Param() params: GetCategoryParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.categoryService.getCategoryById(params);

    return new SuccessResponse('category fetched successfully', result);
  }

  @ApiBearerAuth('access-token')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreateCategoryResponse)
  @Authentication(true)
  public async createCategory(
    @Body() body: CreateCategoryBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.categoryService.createCategory(body);

    return new SuccessResponse('category created successfully', result);
  }

  @ApiBearerAuth('access-token')
  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(UpdateCategoryResponse)
  @Authentication(true)
  public async updateCategory(
    @Param() params: UpdateCategoryParamsValidator,
    @Body() body: UpdateCategoryBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.categoryService.updateCategory(params, body);

    return new SuccessResponse('category fetched successfully', result);
  }

  @ApiBearerAuth('access-token')
  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(DeleteCategoryResponse)
  @Authentication(true)
  public async deleteCategory(
    @Param() params: DeleteCategoryParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.categoryService.deleteCategory(params);

    return new SuccessResponse('site deleted successfully', result);
  }
}
