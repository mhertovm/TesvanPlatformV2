import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { signInDto } from './dto/signIn.dto';
import { forgotPasswordStep1Dto } from './dto/forgotPasswordStep1.dto';
import { forgotPasswordStep2Dto } from './dto/forgotPasswordStep2.dto';
import { forgotPasswordStep3Dto } from './dto/forgotPasswordStep3.dto';
import { PrismaService, Role } from 'src/prisma/prisma.service';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { signUpStep1Dto } from './dto/signUpStep1.dto';
import { signUpStep2Dto } from './dto/signUpStep2.dto';
import { signUpStep3Dto } from './dto/signUpStep3.dto';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { deleteAccountDto } from './dto/deleteAccount.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly db: PrismaService,
        private readonly emailSender: EmailSenderService,
        private readonly configService: ConfigService,
    ) { }

    private otpSendMaxCount: number = 3

    async signIn(signInDto: signInDto) {
        signInDto.email = signInDto.email.toLowerCase();
        const user = await this.userService.findByEmail(signInDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        };

        if (user.userSession && user.userSession.lockUntil && new Date() < user.userSession.lockUntil) {
            const secondsLeft = Math.ceil((user.userSession.lockUntil.getTime() - Date.now()) / 1000);
            throw new BadRequestException(`Account locked. Try again in ${secondsLeft}s`);
        };

        if ((user.userSession?.failedAttempts ?? 0) >= 3) {
            if (!signInDto.captchaToken) throw new BadRequestException('CAPTCHA token is required');
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

            throw new UnauthorizedException('Invalid email or password');
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

    async forgotPasswordStep1({ email }: forgotPasswordStep1Dto) {
        email = email.toLowerCase();
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        const otpCode = Math.floor(10000 + Math.random() * 90000);
        await this.emailSender.sendForgotPasswordEmail(email, otpCode);

        const existingPending = await this.db.pendingRepo.findUnique({
            where: { email },
        });

        if (existingPending) {
            await this.db.pendingRepo.update({
                where: { email },
                data: { otpCode, otpSendMax: this.otpSendMaxCount },
            });
        } else {
            await this.db.pendingRepo.create({
                data: { email, otpCode, otpSendMax: this.otpSendMaxCount },
            });
        }

        return { email };
    }

    async forgotPasswordStep2({ email, otpCode }: forgotPasswordStep2Dto) {
        email = email.toLowerCase();
        const pending = await this.db.pendingRepo.findUnique({ where: { email } });
        if (!pending) throw new NotFoundException('Pending registration not found');

        if (pending.otpCheckMax <= 0) {
            throw new BadRequestException('Verification code sending limit has been exceeded.');
        } else if (!pending.otpCode || pending.otpCode !== otpCode) {
            const otpCheckMaxCount = pending.otpCheckMax - 1;
            await this.db.pendingRepo.update({
                where: { email },
                data: { otpCheckMax: otpCheckMaxCount },
            });
            throw new UnauthorizedException('Invalid verification code.');
        }

        return { otpCode: pending.otpCode, email: pending.email };
    }

    async forgotPasswordStep3({ email, otpCode, password: newPassword }: forgotPasswordStep3Dto) {
        email = email.toLowerCase();
        const pending = await this.db.pendingRepo.findUnique({ where: { email } });
        if (!pending) throw new NotFoundException('Pending registration not found');

        if (pending.otpCheckMax <= 0) {
            throw new BadRequestException('Verification code sending limit has been exceeded.');
        } else if (!pending.otpCode || pending.otpCode !== otpCode) {
            const otpCheckMaxCount = pending.otpCheckMax - 1;
            await this.db.pendingRepo.update({
                where: { email: pending.email },
                data: { otpCheckMax: otpCheckMaxCount },
            });
            throw new UnauthorizedException('Invalid verification code.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const user = await this.userService.updateUser({
            email,
            data: {
                userData: {
                    password: hashedPassword,
                }
            }
        })

        if (!user) {
            throw new BadRequestException('Failed to update password');
        }
        await this.db.pendingRepo.delete({ where: { email } });

        const payload = { sub: user.id, role: user.role };
        const { accessToken, refreshToken } = this.generateTokens(payload);

        return { accessToken, refreshToken };
    }

    async signUpStep1(signUpStep1Dto: signUpStep1Dto) {
        signUpStep1Dto.email = signUpStep1Dto.email.toLowerCase()

        const user = await this.userService.findByEmail(signUpStep1Dto.email);

        if (user) {
            throw new UnauthorizedException('User with this email already exists.');
        };

        await this.db.pendingRepo.deleteMany({
            where: { email: signUpStep1Dto.email },
        });

        const pending = await this.db.pendingRepo.create({
            data: { email: signUpStep1Dto.email },
        });

        return pending.email;
    }

    async signUpStep2(signUpStep2Dto: signUpStep2Dto) {
        signUpStep2Dto.email = signUpStep2Dto.email.toLowerCase();

        const pending = await this.db.pendingRepo.findUnique({ where: { email: signUpStep2Dto.email } });
        if (!pending) throw new NotFoundException('Registration not found');

        const existingUser = await this.userService.findByEmail(signUpStep2Dto.email);
        if (existingUser) {
            throw new UnauthorizedException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(signUpStep2Dto.password, 12);
        const otpCode = Math.floor(10000 + Math.random() * 90000);

        await this.emailSender.sendSignUpEmail(pending.email, otpCode);

        const updatedPending = await this.db.pendingRepo.update({
            where: { email: signUpStep2Dto.email },
            data: {
                ...signUpStep2Dto,
                password: hashedPassword,
                otpCode,
                otpSendMax: this.otpSendMaxCount
            },
        });

        const { email } = updatedPending;

        return { email };
    }

    async signUpStep3({ otpCode, email }: signUpStep3Dto) {
        email = email.toLowerCase()
        const pending = await this.db.pendingRepo.findUnique({ where: { email } });
        if (!pending) throw new NotFoundException('Registration not found');

        if (pending.otpCheckMax <= 0) {
            throw new BadRequestException('Verification code sending limit has been exceeded.');
        } else if (!pending.otpCode || pending.otpCode !== otpCode) {
            const otpCheckMaxCount = pending.otpCheckMax - 1;
            await this.db.pendingRepo.update({
                where: { email },
                data: { otpCheckMax: otpCheckMaxCount },
            });
            throw new UnauthorizedException('Invalid verification code.');
        }

        const user = await this.userService.createUser({
            email: pending.email!,
            firstName: pending.firstName!,
            lastName: pending.lastName!,
            phone: pending.phone ?? undefined,
            country: pending.country ?? undefined,
            city: pending.city ?? undefined,
            englishLevel: pending.englishLevel ?? undefined,
            QABackground: pending.QABackground ?? undefined,
            education: pending.education ?? undefined,
            password: pending.password!,
            dateOfBirth: pending.dateOfBirth!,
            gender: pending.gender!,
            isVerified: true,
            role: Role.STUDENT
        });

        await this.db.pendingRepo.delete({ where: { email } });

        const { password, email: _, phone, role, dateOfBirth, ...userWithoutPassword } = user;
        const payload = { sub: user.id, role: user.role };
        const { accessToken, refreshToken } = this.generateTokens(payload);

        return { user: userWithoutPassword, accessToken, refreshToken };
    }

    async changePassword({ email, currentPassword, newPassword }: ChangePasswordDto) {
        email = email.toLowerCase();
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const updatedUser = await this.userService.updateUser({
            email,
            data: {
                userData: {
                    password: hashedPassword,
                }
            }
        });

        if (!updatedUser) {
            throw new BadRequestException('Failed to update password');
        };

        this.emailSender.sendEmail(updatedUser.email, 'Password Changed Successfully', 'Your password has been changed successfully.' + new Date().toLocaleString());

        return { message: 'Password changed successfully' };
    }

    async deleteAccount({ email, password }: deleteAccountDto) {
        email = email.toLowerCase();
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Password is incorrect');
        }

        await this.userService.deleteUser({ email });
    }

    async sendOtp(email: string) {
        email = email.toLowerCase();
        const pending = await this.db.pendingRepo.findFirst({
            where: { email },
        });

        if (!pending) {
            throw new NotFoundException('Pending record not found. Please try again later.');
        }

        if (pending.otpSendMax <= 0) {
            throw new BadRequestException('Verification code sending limit exceeded. Please restart the registration process.');
        }

        const timeDiff = Date.now() - new Date(pending.updatedAt).getTime();
        if (timeDiff < 30_000) {
            const secondsLeft = Math.ceil((30_000 - timeDiff) / 1000);
            throw new BadRequestException(`Please wait ${secondsLeft} seconds before sending a new verification code.`);
        }

        const otpCode = Math.floor(10000 + Math.random() * 90000);
        await this.emailSender.sendSignUpEmail(pending.email, otpCode);

        const otpSendMaxCount = pending.otpSendMax - 1;

        const updatedPending = await this.db.pendingRepo.update({
            where: { email },
            data: {
                otpCode,
                otpSendMax: otpSendMaxCount,
            },
        });

        if (updatedPending) return { message: 'Verification code send', limit: otpSendMaxCount };
        else throw new NotFoundException('Pending record not found. Please try again later.');
    }

    async signUpExists(email: string) {
        email = email.toLowerCase();
        const pendingUser = await this.db.pendingRepo.findUnique({ where: { email } });
        if (!pendingUser) throw new NotFoundException('Registration not found');
        const { firstName, lastName, email: resEmail, dateOfBirth } = pendingUser;
        return { firstName, lastName, dateOfBirth, email: resEmail };
    }

    async refreshToken(token: string) {
        const JWT_REFRESH_SECRET = this.configService.get<string>('JWT_REFRESH_SECRET')
        const payload = await this.jwtService.verifyAsync(
            token,
            { secret: JWT_REFRESH_SECRET }
        );

        return this.generateTokens(payload);
    }

    private generateTokens(payload: { sub: number, role: string }): { accessToken: string; refreshToken: string } {
        const JWT_SECRET = this.configService.get<string>('JWT_SECRET');
        const JWT_REFRESH_SECRET = this.configService.get<string>('JWT_REFRESH_SECRET');
        const REFRESH_EXPIRES_IN = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

        const accessToken = this.jwtService.sign(payload, { secret: JWT_SECRET });

        const refreshToken = this.jwtService.sign(payload, {
            secret: JWT_REFRESH_SECRET,
            expiresIn: REFRESH_EXPIRES_IN,
        } as any);

        return { accessToken, refreshToken };
    }

    private async verifyCaptcha(token: string): Promise<boolean> {
        if (!token) return false;
        const recaptchaSecretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
        if (!recaptchaSecretKey) return false;
        const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${recaptchaSecretKey}&response=${token}`,
        });

        const json = await res.json();
        return json.success;
    }
}
