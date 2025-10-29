import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
    private transporter: nodemailer.Transporter;

    constructor(readonly configService: ConfigService) {
        const service = this.configService.get('EMAIL_SERVICE') ?? 'gmail';
        const user = this.configService.get('EMAIL_USER');
        const pass = this.configService.get('EMAIL_PASS');
        const host = this.configService.get('EMAIL_HOST');
        const port = this.configService.get<number>('EMAIL_PORT' as any);
        const secure = this.configService.get('EMAIL_SECURE') === 'true';

        this.transporter = nodemailer.createTransport(host ? {
            host,
            port: port ?? 465,
            secure: secure ?? true,
            auth: { user, pass },
        } : {
            service,
            auth: { user, pass },
        });
    }

    private async sendEmail(to: string, subject: string, text: string, html?: string) {
        const from = this.configService.get('EMAIL_FROM');
        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                text,
                html,
            });
            return info;
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }

    async sendSignUpEmail(to: string, otpCode: number) {
        const subject = 'Your verification code';
        const html = `<p>Your verification code is <strong>${otpCode}</strong>. It expires soon.</p>`;
        return this.sendEmail(to, subject, String(otpCode), html);
    }

    async sendForgotPasswordEmail(to: string, otpCode: number) {
        const subject = 'Password reset code';
        const html = `<p>Use this code to reset your password: <strong>${otpCode}</strong>.</p>`;
        return this.sendEmail(to, subject, String(otpCode), html);
    }
}

