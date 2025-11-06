import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseUtils {
    constructor(private readonly prisma: PrismaService) { }

    checkCourseOwnership(courseId: number, teacherId: number) {
        return this.prisma.course.findFirst({
            where: {
                id: courseId,
                creatorId: teacherId
            }
        });
    }
}
