import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpsertCourseMetaDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'courseId is required' })
    @IsNumber()
    courseId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'courseType is required' })
    @IsString()
    courseType: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'courseLevel is required' })
    @IsString()
    courseLevel: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'studentLimit is required' })
    @IsNumber()
    studentLimit: number;
}