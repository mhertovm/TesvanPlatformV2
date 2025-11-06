import { Injectable } from '@nestjs/common';
import { CourseService } from '../course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseUtils } from '../common/course.utils';

@Injectable()
export class CourseTeacherService {
    constructor(
        private readonly courseService: CourseService,
        private readonly utils: CourseUtils
    ) { }

    async upsertCourse(data: CreateCourseDto) {
        if (data.id) {
            const checkOwnership = this.utils.checkCourseOwnership(data.id, data.creatorId);
            if (!checkOwnership) {
                throw new Error('You do not have permission to modify this course.');
            }
        }
        return this.courseService.upsertCourse(data);
    }
}