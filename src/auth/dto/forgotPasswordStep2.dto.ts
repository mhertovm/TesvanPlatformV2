import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsNumber, Min, Max } from 'class-validator';

export class forgotPasswordStep2Dto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty({ message: 'otpCode is required' })
    @IsNumber({}, { message: 'otpCode must be a number' })
    @Min(10000, { message: 'otpCode must be at least 5 digits' })
    @Max(99999, { message: 'otpCode must be at most 5 digits' })
    otpCode: number
}