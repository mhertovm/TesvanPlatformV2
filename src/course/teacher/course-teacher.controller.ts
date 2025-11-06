import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourseTeacherService } from './course-teacher.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { AuthAndGuard } from 'src/auth/auth.decorator';

@AuthAndGuard(['TEACHER'])
@Controller('courses/teacher')
export class CourseTeacherController {
    constructor(private readonly courseTeacherService: CourseTeacherService) { }
    
    @Post('upsert')
    async upsertCourse(@Body() data: CreateCourseDto) {
        return await this.courseTeacherService.upsertCourse(data);
    }
}