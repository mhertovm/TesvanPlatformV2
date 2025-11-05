import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
    constructor(private readonly db: PrismaService) { }

    createCourse(data: any) {
        return this.db.course.create({
            data,
        });
    }

    createPriceToCourse(courseId: number, price: number, discount: number) {
        return this.db.coursePrices.create({
            data: {
                courseId,
                price,
                discount
            },
        });
    }

    addStudentLimitToCourse(courseId: number, studentLimit: number) {
        return this.db.course.update({
            where: { id: courseId },
            data: {
                studentLimit
            }
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

    findAll() {
        return this.db.course.findMany({
            include: {
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
                category: true,
                creator: true,
                price: true,
                teachers: true,
                students: true
            },
        });
    }
}
