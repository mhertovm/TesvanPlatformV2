import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile } from '@nestjs/common';
import { CourseTeacherService } from './course-teacher.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { AuthAndGuard } from 'src/auth/auth.decorator';
import { UpsertCourseMetaDto } from '../dto/upsert-course-meta.dto';
import { User } from 'src/auth/auth.jwtPayload.decorator';
import type { JwtPayload } from 'src/auth/auth.jwtPayload.decorator';
import { UpsertPriceCourseDto } from '../dto/upsert-price-course.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UpsertCourseImageDto } from '../dto/upsert-course-image.dto';

@AuthAndGuard(['TEACHER'])
@Controller('courses/teacher')
export class CourseTeacherController {
    constructor(private readonly courseTeacherService: CourseTeacherService) { }

    @Post()
    async createCourse(
        @Body() data: CreateCourseDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.createCourse(data, creatorId);
    }

    @Get()
    async findAllCoursesByCreator(
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.findAllCoursesByCreator(creatorId);
    }

    @Patch(':id')
    async updateCourse(
        @Param('id') id: number,
        @Body() data: CreateCourseDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.updateCourse(id, data, creatorId);
    }

    @Delete(':id')
    async deleteCourse(
        @Param('id') id: number,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.deleteCourse(id, creatorId);
    }

    @Post('upsertMetaToCourse')
    async upsertMetaToCourse(
        @Body() data: UpsertCourseMetaDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.upsertMetaToCourse(data, creatorId);
    }

    @Post('upsertImageToCourse')
    @ApiConsumes('multipart/form-data')
    async upsertImageToCourse(
        @Body() data: UpsertCourseImageDto,
        @UploadedFile() image: Express.Multer.File,
        @User() user: JwtPayload
    ) {
        const { courseId } = data;
        const { sub: creatorId } = user;
        return await this.courseTeacherService.upsertImageToCourse(image, courseId, creatorId);
    }

    @Post('createPriceToCourse')
    async createPriceToCourse(
        @Body() data: UpsertPriceCourseDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.createPriceToCourse(data, creatorId);
    }

    @Delete('deletePriceFromCourse/:id')
    async deletePriceFromCourse(
        @Param('id') id: number,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        // Ownership check can be added here if needed
        return await this.courseTeacherService.deletePriceFromCourse(id, creatorId);
    }

    @Post('addTeacherToCourse')
    async addTeacherToCourse(
        @Body() { courseId, teacherId }: { courseId: number; teacherId: number },
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.addTeacherToCourse(courseId, teacherId, creatorId);
    }

    @Delete('removeTeacherFromCourse')
    async removeTeacherFromCourse(
        @Body() { courseId, teacherId }: { courseId: number; teacherId: number },
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.removeTeacherFromCourse(courseId, teacherId, creatorId);
    }

    @Post('addStudentToCourse')
    async addStudentToCourse(
        @Body() { courseId, studentId }: { courseId: number; studentId: number },
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.addStudentToCourse(courseId, studentId, creatorId);
    }

    @Delete('removeStudentFromCourse')
    async removeStudentFromCourse(
        @Body() { courseId, studentId }: { courseId: number; studentId: number },
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.removeStudentFromCourse(courseId, studentId, creatorId);
    }
}