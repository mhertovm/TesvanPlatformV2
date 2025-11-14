import { Controller, Get, Param, Query } from '@nestjs/common';
import { CourseGlobalService } from './course-global.service';

@Controller('courses')
export class CourseGlobalController {
  constructor(private readonly courseGlobalService: CourseGlobalService) { }

  @Get()
  findAll(
    @Query('take') take: number = 10,
    @Query('skip') skip: number = 0,
    @Query('language') language: string,
  ) {
    return this.courseGlobalService.findAll(take, skip, language);
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @Query('language') language: string,
  ) {
    return this.courseGlobalService.findOne(+id, language);
  }
}