import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCoursePriceDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'price is required' })
    @IsNumber()
    price: number;

    @ApiProperty({ required: false })
    @IsNumber()
    discount?: number;
}