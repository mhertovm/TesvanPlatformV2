import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddTeacherCourseDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'teacherId is required' })
    @IsNumber()
    teacherIds: number[]
}