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

        this.transporter = nodemailer.createTransport({
            service,
            auth: {
                user,
                pass,
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string, html?: string) {
        const info = await this.transporter.sendMail({
            // from: 'mhertovmasyan@gmail.com',
            to,
            subject,
            text,
            html,
        });

        console.log('Email sent:', info.messageId);
        return info;
    }

    async sendSignUpEmail(to: string, otpCode: number) {
        const info = await this.transporter.sendMail({
            // from: 'mhertovmasyan@gmail.com',
            to,
            subject: "",
            text: `${otpCode}`,
            html: "",
        });

        return info;
    }

    async sendForgotPasswordEmail(to: string, otpCode: number) {
        const info = await this.transporter.sendMail({
            // from: 'mhertovmasyan@gmail.com',
            to,
            subject: "",
            text: `${otpCode}`,
            html: "",
        });

        return info;
    }
}

