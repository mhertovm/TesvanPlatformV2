import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber, Min, Max, MinLength, MaxLength, Matches } from 'class-validator';

export class forgotPasswordStep3Dto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty({ message: 'otpCode is required' })
    @IsNumber({}, { message: 'otpCode must be a number' })
    @Min(10000, { message: 'otpCode must be at least 6 digits' })
    @Max(99999, { message: 'otpCode must be at most 6 digits' })
    otpCode: number

    @ApiProperty()
    @IsNotEmpty({ message: 'password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(24, { message: 'Password must not exceed 24 characters' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Password must include letters and numbers',
    })
    @IsString()
    password: string
}