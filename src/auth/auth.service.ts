import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { signInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }
    async signIn(signInDto: signInDto) {
        signInDto.eOrUn = signInDto.eOrUn.toLowerCase();
        const user = await this.userService.findByEmail(signInDto.eOrUn);

        if (!user) {
            throw new UnauthorizedException('Invalid username/email or password');
        };

        if (user.userSession && user.userSession.lockUntil && new Date() < user.userSession.lockUntil) {
            const secondsLeft = Math.ceil((user.userSession.lockUntil.getTime() - Date.now()) / 1000);
            throw new BadRequestException(`Account locked. Try again in ${secondsLeft}s`);
        };

        if ((user.userSession?.failedAttempts ?? 0) >= 3) {
            const isValidCaptcha = await this.verifyCaptcha(signInDto.captchaToken);
            if (!isValidCaptcha) throw new BadRequestException('Invalid CAPTCHA');
        }

        const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);
        if (!isPasswordValid) {
            const failedAttempts = (user.userSession?.failedAttempts ?? 0) + 1;
            const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 60 * 1000) : null;

            await this.userService.updateUser({
                userId: user.id,
                data: {
                    userSessionData: {
                        failedAttempts,
                        lastFailedAt: new Date(),
                        lockUntil,
                    }
                }
            })

            throw new UnauthorizedException('Invalid username/email or password');
        };

        await this.userService.updateUser({
            userId: user.id,
            data: {
                userSessionData: {
                    failedAttempts: 0,
                    lastFailedAt: null,
                    lockUntil: null,
                }
            }
        });

        const { password: _, email, phone, role, dateOfBirth, ...userWithoutPassword } = user;
        const payload = { sub: user.id, role: user.role };
        const { accessToken, refreshToken } = this.generateTokens(payload);

        return { user: userWithoutPassword, accessToken, refreshToken };
    }

    private generateTokens(payload: { sub: number, role: string }): { accessToken: string; refreshToken: string } {
        const JWT_SECRET = process.env.JWT_SECRET ?? 'default-secret-key';
        const accessToken = this.jwtService.sign(payload, {
            secret: JWT_SECRET,
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            expiresIn: '365d',
        });

        return { accessToken, refreshToken };
    }

    private async verifyCaptcha(token: string): Promise<boolean> {
        if (!token) return false;

        const secret = process.env.RECAPTCHA_SECRET_KEY || '6Lf_C3srAAAAAJnMkLh2v7M1mP8PTslu2uDYy2JR';
        const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secret}&response=${token}`,
        });

        const json = await res.json();
        return json.success;
    }
}
