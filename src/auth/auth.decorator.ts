import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

type NonEmptyStringArray = [string, ...string[]];

export const AuthAndGuard = (roles: NonEmptyStringArray) => {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard),
    );
}