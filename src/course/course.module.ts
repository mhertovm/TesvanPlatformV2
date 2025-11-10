import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseGlobalController } from './global/course-global.controller';
import { CourseGlobalService } from './global/course-global.service';
import { CourseTeacherController } from './teacher/course-teacher.controller';
import { CourseTeacherService } from './teacher/course-teacher.service';
import { CourseUtils } from './common/course.utils';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule
  ],
  controllers: [
    CourseGlobalController,
    CourseTeacherController
  ],
  providers: [
    CourseService,
    CourseUtils,
    CourseGlobalService,
    CourseTeacherService
  ],
})
export class CourseModule {}
