import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCoursePriceDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'priceId is required' })
    @IsNumber()
    priceId: number;
}