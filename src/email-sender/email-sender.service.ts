import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mhertovmasyan@gmail.com',
            pass: 'nrly',
        },
    });

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

