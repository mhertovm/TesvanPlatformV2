import { Injectable } from '@nestjs/common';
import { CourseStatus, PrismaService } from 'src/prisma/prisma.service';
import { UpsertCourseMetaDto } from './dto/upsert-course-meta.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UploadService } from 'src/upload/upload.service';
import { CreateCoursePriceDto } from './dto/create-course-price.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(
        private readonly db: PrismaService,
        private readonly uploadService: UploadService
    ) { }

    createCourse(data: CreateCourseDto, creatorId: number) {
        return this.db.course.create({ data: { ...data, creatorId } });
    }


    updateCourse(id: number, data: UpdateCourseDto, creatorId: number) {
        return this.db.course.update({
            where: { id, creatorId },
            data,
        });
    }

    upsertMetaToCourse(data: UpsertCourseMetaDto, courseId: number) {
        return this.db.courseMeta.upsert({
            where: { courseId },
            update: { ...data, status: CourseStatus.DRAFT, courseId },
            create: { ...data, status: CourseStatus.DRAFT, courseId },
        });
    }

    async upsertImageToCourse(courseId: number, file: Express.Multer.File, creatorId: number) {
        const course = await this.findOne(courseId); // Ensure the course exists
        if (course?.creatorId !== creatorId) {
            throw new Error('You do not have permission to modify this course.');
        };

        if (course?.imageUrl) {
            await this.uploadService.deleteFile(course.imageUrl);
        };
        // save to cloud storage and get the URL
        const imageUrl = this.uploadService.uploadImg(file).path;

        return this.db.course.update({
            where: { id: courseId },
            data: { imageUrl },
        });
    }

    deleteCourse(id: number, creatorId: number) {
        return this.db.course.delete({
            where: { id, creatorId },
        });
    }

    createPriceToCourse({ price, discount }: CreateCoursePriceDto, courseId: number) {
        return this.db.coursePrices.create({
            data: {
                courseId,
                price,
                discount
            },
        });
    }

    deletePriceFromCourse(id: number) {
        return this.db.coursePrices.delete({
            where: { id },
        });
    }

    addTeacherToCourse(courseId: number, teacherIds: number[]) {
        teacherIds = Array.isArray(teacherIds) ? teacherIds : [teacherIds]
        return this.db.course.update({
            where: { id: courseId },
            data: {
                teachers: {
                    connect: teacherIds.map(id => ({ id })),
                },
            },
        });
    }

    removeTeacherFromCourse(courseId: number, teacherId: number) {
        return this.db.course.update({
            where: { id: courseId },
            data: {
                teachers: {
                    disconnect: { id: teacherId },
                },
            },
        });
    }

    addStudentToCourse(courseId: number, studentIds: number[]) {
        studentIds = Array.isArray(studentIds) ? studentIds : [studentIds]

        return this.db.course.update({
            where: { id: courseId },
            data: {
                students: {
                    connect: studentIds.map(id => ({ id })),
                },
            },
        });
    }

    removeStudentFromCourse(courseId: number, studentId: number) {
        return this.db.course.update({
            where: { id: courseId },
            data: {
                students: {
                    disconnect: { id: studentId },
                },
            },
        });
    }

    findAllCoursesByCreator(creatorId: number) {
        return this.db.course.findMany({
            where: { creatorId },
            include: {
                meta: true,
                category: true,
                creator: true,
                price: true,
                teachers: true,
                students: true
            },
        });
    }

    findAll() {
        return this.db.course.findMany({
            include: {
                meta: true,
                category: true,
                creator: true,
                price: true,
                teachers: true,
                students: true
            },
        });
    }

    findOne(id: number) {
        return this.db.course.findUnique({
            where: { id },
            include: {
                meta: true,
                category: true,
                creator: true,
                price: true,
                teachers: true,
                students: true
            },
        });
    }
}
