import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const customMulterOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      let folder = 'upload';

      if (file.fieldname === 'courseImage') {
        folder = 'upload/course';
      } else if (file.fieldname === 'userImage') {
        folder = 'upload/user';
      } else if (file.fieldname === 'pdf') {
        folder = 'upload/pdf';
      }

      if (!existsSync(folder)) {
        mkdirSync(folder, { recursive: true });
      }

      callback(null, folder);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),

  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void => {
    const allowedTypes = /\.(jpg|jpeg|png|gif|pdf)$/i;

    if (!file.originalname.match(allowedTypes)) {
      return callback(new Error('Only image and PDF files are allowed!'), false);
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
};