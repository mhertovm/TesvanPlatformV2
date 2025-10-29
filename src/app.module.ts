import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailSenderModule } from './email-sender/email-sender.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, UserModule, EmailSenderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
