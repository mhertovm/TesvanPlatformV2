import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseUtils {
    constructor(private readonly prisma: PrismaService) { }

    checkCourseOwnership(courseId: number, creatorId: number) {
        return this.prisma.course.findUnique({
            where: {
                id: courseId,
                creatorId: creatorId
            }
        });
    }

    checkCourseMembershipAndGet(courseId: number, memberId: number) {
        const course = this.prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                imageUrl: true,
                meta: true,
                price: true,
                students: true,
                teachers: {
                    where: { id: memberId },
                    select: { id: true },
                }
            }
        });

        if (!course || course.teachers.length === 0) {
            return null;
        }

        return course;
    }
}
