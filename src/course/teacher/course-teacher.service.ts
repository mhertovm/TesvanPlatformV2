import { Injectable } from '@nestjs/common';
import { CourseService } from '../course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseUtils } from '../common/course.utils';
import { UpsertCourseMetaDto } from '../dto/upsert-course-meta.dto';
import { UpsertPriceCourseDto } from '../dto/upsert-price-course.dto';

@Injectable()
export class CourseTeacherService {
    constructor(
        private readonly courseService: CourseService,
        private readonly utils: CourseUtils,
    ) { }

    async createCourse(data: CreateCourseDto, creatorId: number) {
        return this.courseService.createCourse(data, creatorId);
    }

    async findAllCoursesByCreator(creatorId: number) {
        return this.courseService.findAllCoursesByCreator(creatorId);
    }

    async updateCourse(id: number, data: CreateCourseDto, creatorId: number) {
        return this.courseService.updateCourse(id, data, creatorId);
    }

    async upsertMetaToCourse(data: UpsertCourseMetaDto, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnership(data.courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        };

        return this.courseService.upsertMetaToCourse(data);
    }

    async upsertImageToCourse(image: Express.Multer.File, courseId: number, creatorId: number) {
        return this.courseService.upsertImageToCourse(courseId, image, creatorId);
    }

    async deleteCourse(id: number, creatorId: number) {
        return this.courseService.deleteCourse(id, creatorId);
    }

    async createPriceToCourse(data: UpsertPriceCourseDto, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnership(data.courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.createPriceToCourse(data);
    }

    async deletePriceFromCourse(id: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnership(id, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.deletePriceFromCourse(id);
    }

    async addTeacherToCourse(courseId: number, teacherId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnership(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.addTeacherToCourse(courseId, teacherId);
    }

    async removeTeacherFromCourse(courseId: number, teacherId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnership(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.removeTeacherFromCourse(courseId, teacherId);
    }

    async addStudentToCourse(courseId: number, studentId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnership(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.addStudentToCourse(courseId, studentId);
    }

    async removeStudentFromCourse(courseId: number, studentId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnership(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.removeStudentFromCourse(courseId, studentId);
    }
}