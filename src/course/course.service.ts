import { Injectable } from '@nestjs/common';
import { CourseStatus, PrismaService } from 'src/prisma/prisma.service';
import { UpsertCourseMetaDto } from './dto/upsert-course-meta.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UploadService } from 'src/upload/upload.service';
import { UpsertPriceCourseDto } from './dto/upsert-price-course.dto';
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

    upsertMetaToCourse(data: UpsertCourseMetaDto) {
        return this.db.courseMeta.upsert({
            where: { courseId: data.courseId },
            update: { ...data, status: CourseStatus.DRAFT },
            create: { ...data, status: CourseStatus.DRAFT },
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

    createPriceToCourse({ courseId, price, discount }: UpsertPriceCourseDto) {
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

    addTeacherToCourse(courseId: number, teacherId: number) {
        return this.db.course.update({
            where: { id: courseId },
            data: {
                teachers: {
                    connect: { id: teacherId },
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

    addStudentToCourse(courseId: number, studentId: number) {
        return this.db.course.update({
            where: { id: courseId },
            data: {
                students: {
                    connect: { id: studentId },
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
