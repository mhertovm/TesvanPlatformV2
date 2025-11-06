export class CreateCourseDto {
    id?: number;
    title_en: string;
    title_am: string;
    title_ru: string;
    description_en: string;
    description_am: string;
    description_ru: string;
    shortDescription_en: string;
    shortDescription_am: string;
    shortDescription_ru: string;
    imageUrl?: string;
    categoryId: number;
    creatorId: number;
}
