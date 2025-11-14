import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpsertCourseImageDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Img file to be processed',
    })
    courseImage: string;
}
