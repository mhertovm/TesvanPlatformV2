import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class signUpStep1Dto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string
}