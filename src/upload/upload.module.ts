import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { customMulterOptions } from './upload.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register(customMulterOptions),
  ],
  providers: [UploadService],
  exports: [UploadService, MulterModule],
})
export class UploadModule { }
