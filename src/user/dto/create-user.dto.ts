import { Role } from "src/prisma/prisma.service";

export class CreateUserDto {
    firstName: string;
    lastName: string;
    imageUrl?: string;
    phone?: string;
    country?: string;
    city?: string;
    englishLevel?: string;
    QABackground?: boolean;
    education?: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    gender: string;
    creatorId?: number;
    status?: boolean;
    role?: Role;
}
