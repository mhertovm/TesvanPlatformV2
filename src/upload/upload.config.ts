import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';

export const customMulterOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {

      let logDir = path.join(__dirname, '../../../upload');

      if (file.fieldname === 'courseImage') {
        logDir = path.join(logDir, 'courseImage');
      } else if (file.fieldname === 'userImage') {
        logDir = path.join(logDir, 'userImage');
      } else if (file.fieldname === 'pdf') {
        logDir = path.join(logDir, 'pdf');
      }

      // Create the upload folder if it doesn't exist
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      callback(null, logDir);
    },

    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);

      const subDir = file.fieldname === 'courseImage'
        ? 'courseImage'
        : file.fieldname === 'userImage'
          ? 'userImage'
          : file.fieldname === 'pdf'
            ? 'pdf'
            : '';


      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
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