import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { defaultLanguage, LanguagesType, validLanguages } from "src/types/language.type";

@Injectable()
export class CoursePrismaExtension {
    constructor(
        private readonly db: PrismaService
    ) { }

    default() {
        return this.db
    }

    useLanguge(language?: string) {
        const lang = language ?? defaultLanguage;
        if (!validLanguages.includes(lang as LanguagesType)) {
            throw new Error(`Invalid language: ${lang}`);
        }

        return this.db.$extends({
            result: {
                course: {
                    title: {
                        needs: {
                            title_am: true,
                            title_en: true,
                            title_ru: true,
                        },
                        compute(course: any) {
                            return course[`title_${language}`];
                        },
                    },
                    description: {
                        needs: {
                            description_am: true,
                            description_en: true,
                            description_ru: true,
                        },
                        compute(course: any) {
                            return course[`description_${language}`];
                        },
                    },
                    shortDescription: {
                        needs: {
                            shortDescription_am: true,
                            shortDescription_ru: true,
                            shortDescription_en: true
                        },
                        compute(course: any) {
                            return course[`shortDescription_${language}`];
                        }
                    }
                },
                courseCategories: {
                    name: {
                        needs: {
                            name_am: true,
                            name_en: true,
                            name_ru: true,
                        },
                        compute(courseCategories: any) {
                            return courseCategories[`name_${language}`];
                        },
                    }
                },
            },
        })
    }
}




