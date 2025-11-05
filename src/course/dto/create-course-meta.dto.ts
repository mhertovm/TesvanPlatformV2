import { CourseStatus } from "src/prisma/prisma.service";

export class CreateCourseMetaDto {
    courseId: number;
    courseType: string;
    courseLevel: string;
    status: CourseStatus;
    studentLimit: number;
}