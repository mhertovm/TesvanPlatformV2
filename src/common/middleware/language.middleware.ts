import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { defaultLanguage, validLanguages, LanguagesType } from 'src/common/types/language.type';


@Injectable()
export class LanguageMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        let lang = req.query.language as string;

        // language not
        if (!lang) {
            lang = defaultLanguage;
        }

        // language invalid
        if (!validLanguages.includes(lang as LanguagesType)) {
            throw new BadRequestException(`Invalid language: ${lang}`);
        }

        next();
    }
}