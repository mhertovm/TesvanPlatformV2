import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddStudentCourseDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'studentId is required' })
    @IsNumber()
    studentId: number
}