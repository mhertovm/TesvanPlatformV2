import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService, PrismaType } from "src/prisma/prisma.service";


type BaseData = {
    data: {
        userData?: Partial<PrismaType.UserUpdateInput>;
        userSessionData?: Partial<PrismaType.UserSessionUpdateInput>;
    };
};

type UserUpdateType =
    | ({ userId: number; email?: never; username?: never } & BaseData)
    | ({ email: string; userId?: never; username?: never } & BaseData)

@Injectable()
export class UserService {
    constructor(private readonly db: PrismaService) { }

    async findByEmail(email: string) {
        return this.db.user.findFirst({
            where: {
                email: email,
            },
            include: { userSession: true },
        });
    }

    async createUser(createUserDto: CreateUserDto) {
        return this.db.user.create({
            data: {
                ...createUserDto,
                userSession: {
                    create: {
                        failedAttempts: 0,
                        lastFailedAt: null,
                        lockUntil: null,
                    },
                },
            },
        });
    }

    async updateUser({ userId, email, data }: UserUpdateType) {
        let whereClause: PrismaType.UserWhereUniqueInput | undefined;

        if (userId) {
            whereClause = { id: userId };
        } else if (email) {
            whereClause = { email };
        }

        if (!whereClause) {
            throw new Error('Either userId or email must be provided to update a user.');
        }

        const updatePayload: PrismaType.UserUpdateInput = {};

        if (data.userData) {
            Object.assign(updatePayload, data.userData);
        }

        if (data.userSessionData) {
            updatePayload.userSession = {
                update: data.userSessionData,
            };
        }

        return this.db.user.update({
            where: whereClause,
            data: updatePayload,
        });
    }

    async deleteUser({ email }: { email: string }) {
        return this.db.user.delete({
            where: { email },
        });
    }

}
