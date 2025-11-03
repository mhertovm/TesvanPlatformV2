import { Controller, HttpCode, Post, Body, HttpStatus, Get, Query } from '@nestjs/common';
import { signInDto } from './dto/signIn.dto';
import { forgotPasswordStep1Dto } from './dto/forgotPasswordStep1.dto';
import { forgotPasswordStep2Dto } from './dto/forgotPasswordStep2.dto';
import { forgotPasswordStep3Dto } from './dto/forgotPasswordStep3.dto';
import { AuthService } from './auth.service';
import { signUpStep1Dto } from './dto/signUpStep1.dto';
import { signUpStep2Dto } from './dto/signUpStep2.dto';
import { signUpStep3Dto } from './dto/signUpStep3.dto';
import { sendOTPDto } from './dto/sendOTP.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signIn(@Body() signInDto: signInDto) {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgotPassword1')
    forgotPasswordStep1(@Body() forgotPasswordStep1Dto: forgotPasswordStep1Dto) {
        return this.authService.forgotPasswordStep1(forgotPasswordStep1Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgotPassword2')
    forgotPasswordStep2(@Body() forgotPasswordStep2Dto: forgotPasswordStep2Dto) {
        return this.authService.forgotPasswordStep2(forgotPasswordStep2Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgotPassword3')
    forgotPasswordStep3(@Body() forgotPasswordStep3Dto: forgotPasswordStep3Dto) {
        return this.authService.forgotPasswordStep3(forgotPasswordStep3Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Get('signUpExists')
    signUpExists(@Query() { email }: { email: string }) {
        return this.authService.signUpExists(email);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('signUp1')
    signUp1(@Body() signUpStep1Dto: signUpStep1Dto) {
        return this.authService.signUpStep1(signUpStep1Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signUp2')
    signUp2(@Body() signUpStep2Dto: signUpStep2Dto) {
        return this.authService.signUpStep2(signUpStep2Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signUp3')
    signUp3(@Body() signUpStep3Dto: signUpStep3Dto) {
        return this.authService.signUpStep3(signUpStep3Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sendOtp')
    sendOtp(@Body() sendOTPDto: sendOTPDto) {
        return this.authService.sendOtp(sendOTPDto.email);
    }
}
