import { Controller, Get, Param } from '@nestjs/common';
import { CourseGlobalService } from './course-global.service';

@Controller('courses')
export class CourseGlobalController {
  constructor(private readonly courseGlobalService: CourseGlobalService) {}

  @Get()
  findAll() {
    return this.courseGlobalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseGlobalService.findOne(+id);
  }
}