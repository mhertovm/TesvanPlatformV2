import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'title_en is required' })
    @IsString()
    title_en: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'title_am is required' })
    @IsString()
    title_am: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'title_ru is required' })
    @IsString()
    title_ru: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description_en is required' })
    @IsString()
    description_en: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description_am is required' })
    @IsString()
    description_am: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description_ru is required' })
    @IsString()
    description_ru: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'shortDescription_en is required' })
    @IsString()
    shortDescription_en: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'shortDescription_am is required' })
    @IsString()
    shortDescription_am: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'shortDescription_ru is required' })
    @IsString()
    shortDescription_ru: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'categoryId is required' })
    @IsNumber()
    categoryId: number;
}
