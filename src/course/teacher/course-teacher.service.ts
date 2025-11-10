import { Injectable } from '@nestjs/common';
import { CourseService } from '../course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseUtils } from '../common/course.utils';
import { UpsertCourseMetaDto } from '../dto/upsert-course-meta.dto';
import { CreateCoursePriceDto } from '../dto/create-course-price.dto';

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

    async upsertMetaToCourse(data: UpsertCourseMetaDto, courseId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnershipAndGet(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        };

        return this.courseService.upsertMetaToCourse(data, courseId);
    }

    async getCourseMeta(courseId: number, memberId: number) {
        const course = await this.utils.checkCourseMembershipAndGet(courseId, memberId)
        if (!course) {
            throw new Error('You do not have permission to get this course.');
        };
        return course?.meta
    }

    async upsertImageToCourse(image: Express.Multer.File, courseId: number, creatorId: number) {
        return this.courseService.upsertImageToCourse(courseId, image, creatorId);
    }

    async getCourseImage(courseId: number, memberId: number) {
        const course = await this.utils.checkCourseMembershipAndGet(courseId, memberId)
        if (!course) {
            throw new Error('You do not have permission to get this course.');
        };
        return course?.imageUrl
    }

    async deleteCourse(id: number, creatorId: number) {
        return this.courseService.deleteCourse(id, creatorId);
    }

    async createPriceToCourse(data: CreateCoursePriceDto, courseId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnershipAndGet(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.createPriceToCourse(data, courseId);
    }

    async getCoursePrice(courseId: number, memberId: number) {
        const course = await this.utils.checkCourseMembershipAndGet(courseId, memberId)
        if (!course) {
            throw new Error('You do not have permission to get this course.');
        };
        return course?.price
    }

    async deletePriceFromCourse(id: number, courseId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnershipAndGet(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.deletePriceFromCourse(id);
    }

    async addTeacherToCourse(courseId: number, teacherIds: number[], creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnershipAndGet(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.addTeacherToCourse(courseId, teacherIds);
    }

    async getCourseTeachers(courseId: number, memberId: number) {
        // respons one teachers on course
        const checkCourse = await this.utils.checkCourseMembershipAndGet(courseId, memberId)
        if (!checkCourse) {
            throw new Error('You do not have permission to get this course.');
        };
        // respons all teachers on course
        const course = await this.courseService.findOne(courseId);
        return course?.teachers
    }

    async removeTeacherFromCourse(courseId: number, teacherId: number, creatorId: number) {
        const checkOwnership = await this.utils.checkCourseOwnershipAndGet(courseId, creatorId);
        if (!checkOwnership) {
            throw new Error('You do not have permission to modify this course.');
        }
        return this.courseService.removeTeacherFromCourse(courseId, teacherId);
    }

    async getCourseStudent(courseId: number, memberId: number) {
        const course = await this.utils.checkCourseMembershipAndGet(courseId, memberId)
        if (!course) {
            throw new Error('You do not have permission to get this course.');
        };
        return course?.students
    }
}