import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Role } from 'src/prisma/prisma.service';

type NonEmptyStringArray = [Role, ...Role[]];

export const AuthAndGuard = (roles: NonEmptyStringArray) => {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard),
    );
}