import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '30m' },
    }),
    EmailSenderModule,
    UserModule,
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
