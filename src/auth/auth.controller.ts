import { Controller, HttpCode, Post, Body, HttpStatus, Get, Query, Delete, Patch } from '@nestjs/common';
import { signInDto } from './dto/signIn.dto';
import { forgotPasswordStep1Dto } from './dto/forgotPasswordStep1.dto';
import { forgotPasswordStep2Dto } from './dto/forgotPasswordStep2.dto';
import { forgotPasswordStep3Dto } from './dto/forgotPasswordStep3.dto';
import { AuthService } from './auth.service';
import { signUpStep1Dto } from './dto/signUpStep1.dto';
import { signUpStep2Dto } from './dto/signUpStep2.dto';
import { signUpStep3Dto } from './dto/signUpStep3.dto';
import { sendOTPDto } from './dto/sendOTP.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { deleteAccountDto } from './dto/deleteAccount.dto';
import { AuthAndGuard } from './auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './auth.jwtPayload.decorator';
import type { JwtPayload } from './auth.jwtPayload.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(@Body() signInDto: signInDto) {
        return await this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Get('signUpExists')
    async signUpExists(@Query() { email }: { email: string }) {
        return await this.authService.signUpExists(email);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signUp1')
    async signUp1(@Body() signUpStep1Dto: signUpStep1Dto) {
        return await this.authService.signUpStep1(signUpStep1Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signUp2')
    async signUp2(@Body() signUpStep2Dto: signUpStep2Dto) {
        return await this.authService.signUpStep2(signUpStep2Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signUp3')
    async signUp3(@Body() signUpStep3Dto: signUpStep3Dto) {
        return await this.authService.signUpStep3(signUpStep3Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgotPassword1')
    async forgotPasswordStep1(@Body() forgotPasswordStep1Dto: forgotPasswordStep1Dto) {
        return await this.authService.forgotPasswordStep1(forgotPasswordStep1Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgotPassword2')
    async forgotPasswordStep2(@Body() forgotPasswordStep2Dto: forgotPasswordStep2Dto) {
        return await this.authService.forgotPasswordStep2(forgotPasswordStep2Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgotPassword3')
    async forgotPasswordStep3(@Body() forgotPasswordStep3Dto: forgotPasswordStep3Dto) {
        return await this.authService.forgotPasswordStep3(forgotPasswordStep3Dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sendOtp')
    async sendOtp(@Body() sendOTPDto: sendOTPDto) {
        return await this.authService.sendOtp(sendOTPDto.email);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('changePassword')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return await this.authService.changePassword(changePasswordDto);
    }

    @HttpCode(HttpStatus.OK)
    @Delete('deleteAccount')
    async deleteAccount(@Body() deleteAccountDto: deleteAccountDto) {
        return await this.authService.deleteAccount(deleteAccountDto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('refresh-token')
    @AuthAndGuard(['ADMIN', 'STUDENT', 'TEACHER', 'SUPERADMIN'])
    @Post('refreshToken')
    refreshToken(@User() user: JwtPayload) {
        return this.authService.refreshToken(user);
    }
}
