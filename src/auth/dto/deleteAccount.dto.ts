import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class deleteAccountDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'current password is required' })
    password: string;
}