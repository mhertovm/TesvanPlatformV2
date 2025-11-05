import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CourseService } from './course.service';
import { CourseGlobalController } from './global/course-global.controller';
import { CourseGlobalService } from './global/course-global.service';

@Module({
  imports: [AuthService],
  controllers: [CourseGlobalController],
  providers: [
    CourseService,
    CourseGlobalService
  ],
})
export class CourseModule {}
