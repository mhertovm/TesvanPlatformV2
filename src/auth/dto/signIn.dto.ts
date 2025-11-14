import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class signInDto {
    @ApiProperty({ default: "sochialmedia012@gmail.com" })
    @IsNotEmpty({ message: 'email or username is required' })
    @IsString()
    email: string;

    @ApiProperty({ default: "Mt12345678" })
    @IsNotEmpty({ message: 'password is required' })
    @IsString()
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    captchaToken: string
}