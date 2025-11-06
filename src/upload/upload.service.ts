import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = './upload';

  uploadImg(file: Express.Multer.File) {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!file || !allowedExts.includes(ext)) {
      throw new BadRequestException('Invalid image file.');
    }

    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
  }

  uploadPdf(file: Express.Multer.File) {
    if (!file || path.extname(file.originalname).toLowerCase() !== '.pdf') {
      throw new BadRequestException('Invalid PDF file.');
    }

    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file "${filePath}":`, error.message);
    }
  }
}
