import { Controller, HttpCode, Post , Body, HttpStatus} from '@nestjs/common';
import { signInDto } from './dto/signIn.dto';
import { forgotPasswordStep1Dto } from './dto/forgotPasswordStep1.dto';
import { forgotPasswordStep2Dto } from './dto/forgotPasswordStep2.dto';
import { forgotPasswordStep3Dto } from './dto/forgotPasswordStep3.dto';
import { AuthService } from './auth.service';

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
}
