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
}
