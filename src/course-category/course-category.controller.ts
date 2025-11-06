import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) { }

  @Post()
  async create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return await this.courseCategoryService.create(createCourseCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.courseCategoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseCategoryService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseCategoryDto: UpdateCourseCategoryDto) {
    return await this.courseCategoryService.update(+id, updateCourseCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.courseCategoryService.remove(+id);
  }
}
