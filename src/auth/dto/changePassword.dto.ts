import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches, MaxLength, MinLength, IsString } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'current password is required' })
    currentPassword: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(24, { message: 'Password must not exceed 24 characters' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Password must include letters and numbers',
    })
    @IsString()
    newPassword: string;
}