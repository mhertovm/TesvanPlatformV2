import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, MinLength, MaxLength, Matches, IsEmail, IsIn, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class signUpStep2Dto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty({ message: 'firstName is required' })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'First name can only contain letters, numbers, and underscores',
    })
    @IsString()
    firstName: string

    @ApiProperty()
    @IsNotEmpty({ message: 'lastName is required' })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Last name can only contain letters, numbers, and underscores',
    })
    @IsString()
    lastName: string

    @ApiProperty()
    @IsString()
    phone: string

    @ApiProperty()
    @IsString()
    country: string

    @ApiProperty()
    @IsString()
    city: string

    @ApiProperty()
    @IsString()
    englishLevel: string

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    QABackground: boolean

    @ApiProperty()
    @IsString()
    education: string

    @ApiProperty({ enum: ['Male', 'Female', 'Other'], example: 'Male' })
    @IsNotEmpty({ message: 'Gender is required' })
    @IsString({ message: 'Gender must be a string' })
    @IsIn(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other' })
    gender: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'dateOfBirth is required' })
    @Type(() => Date)
    @IsDate({ message: 'dateOfBirth must be a valid date' })
    dateOfBirth: Date

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