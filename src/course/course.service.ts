import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseMetaDto } from './dto/create-course-meta.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
    constructor(private readonly db: PrismaService) { }

    upsertCourse(data: CreateCourseDto) {
        const { id, ...rest } = data;

        if (id) {
            return this.db.course.upsert({
                where: { id },
                update: rest,
                create: rest,
            });
        } else {
            return this.db.course.create({ data: rest });
        }
    }

    upsertMetaToCourse(data: CreateCourseMetaDto) {
        return this.db.courseMeta.upsert({
            where: { courseId: data.courseId },
            update: data,
            create: data,
        });
    }

    // upsertImageToCourse(courseId: number, image: base64) {
    //     return this.db.course.upsert({
    //         where: { id:courseId },
    //         update: { image },
    //         create: { courseId, image },
    //     });
    // }

    createPriceToCourse(courseId: number, price: number, discount: number) {
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

    deleteTeacherFromCourse(courseId: number, teacherId: number) {
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

    deleteStudentFromCourse(courseId: number, studentId: number) {
        return this.db.course.update({
            where: { id: courseId },
            data: {
                students: {
                    disconnect: { id: studentId },
                },
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
