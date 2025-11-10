import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile } from '@nestjs/common';
import { CourseTeacherService } from './course-teacher.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { AuthAndGuard } from 'src/auth/auth.decorator';
import { UpsertCourseMetaDto } from '../dto/upsert-course-meta.dto';
import { User } from 'src/auth/auth.jwtPayload.decorator';
import type { JwtPayload } from 'src/auth/auth.jwtPayload.decorator';
import { CreateCoursePriceDto } from '../dto/create-course-price.dto'
import { ApiConsumes } from '@nestjs/swagger';
import { UpsertCourseImageDto } from '../dto/upsert-course-image.dto';
import { AddTeacherCourseDto } from '../dto/add-teacher-course.dto';
import { DeleteCoursePriceDto } from '../dto/delete-course-price.dto';
import { DeleteTeacherCourseDto } from '../dto/delete-teacher-course.dto';

@AuthAndGuard(['TEACHER'])
@Controller('course/teacher')
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

    @Put(':id')
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

    @Post('upsertMetaToCourse/:courseId')
    async upsertMetaToCourse(
        @Param('courseId') courseId: number,
        @Body() data: UpsertCourseMetaDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.upsertMetaToCourse(data, courseId, creatorId);
    }

    @Get('courseMeta/:courseId')
    async getCourseMeta(
        @Param('courseId') courseId: number,
        @User() user: JwtPayload
    ) {
        const { sub: memberId } = user;
        return await this.courseTeacherService.getCourseMeta(courseId, memberId);
    }

    @Post('upsertImageToCourse/:courseId')
    @ApiConsumes('multipart/form-data')
    async upsertImageToCourse(
        @Param('courseId') courseId: number,
        @Body() data: UpsertCourseImageDto, // this add for swager req. binar data
        @UploadedFile() image: Express.Multer.File,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.upsertImageToCourse(image, courseId, creatorId);
    }

    @Get('courseImage/:courseId')
    async getCourseImage(
        @Param('courseId') courseId: number,
        @User() user: JwtPayload
    ) {
        const { sub: memberId } = user;
        return await this.courseTeacherService.getCourseImage(courseId, memberId);
    }

    @Post('createCoursePrice/:courseId')
    async createPriceToCourse(
        @Param('courseId') courseId: number,
        @Body() data: CreateCoursePriceDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.createPriceToCourse(data, courseId, creatorId);
    }

    @Get('coursePrices/:courseId')
    async getPriceToCourse(
        @Param('courseId') courseId: number,
        @User() user: JwtPayload
    ) {
        const { sub: memberId } = user;
        return await this.courseTeacherService.getCoursePrice(courseId, memberId);
    }

    @Delete('deleteCoursePrice/:courseId')
    async deletePriceFromCourse(
        @Param('courseId') courseId: number,
        @Body() { priceId }: DeleteCoursePriceDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        // Ownership check can be added here if needed
        return await this.courseTeacherService.deletePriceFromCourse(priceId, courseId, creatorId);
    }

    @Post('addTeacherToCourse/:courseId')
    async addTeacherToCourse(
        @Param("courseId") courseId: number,
        @Body() { teacherIds }: AddTeacherCourseDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.addTeacherToCourse(courseId, teacherIds, creatorId);
    }

    @Get('courseTeachers/:courseId')
    async getCourseTeachers(
        @Param("courseId") courseId: number,
        @User() user: JwtPayload
    ) {
        const { sub: memberId } = user;
        return await this.courseTeacherService.getCourseTeachers(courseId, memberId)
    }

    @Delete('removeTeacherFromCourse/:courseId')
    async removeTeacherFromCourse(
        @Param("courseId") courseId: number,
        @Body() { teacherId }: DeleteTeacherCourseDto,
        @User() user: JwtPayload
    ) {
        const { sub: creatorId } = user;
        return await this.courseTeacherService.removeTeacherFromCourse(courseId, teacherId, creatorId);
    }

    @Get('courseStudents/:courseId')
    async getCourseStudents(
        @Param("courseId") courseId: number,
        @User() user: JwtPayload
    ) {
        const { sub: memberId } = user;
        return await this.courseTeacherService.getCourseStudent(courseId, memberId)
    }
}