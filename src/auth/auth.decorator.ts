import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Role } from 'src/prisma/prisma.service';
import { ApiBearerAuth } from '@nestjs/swagger';

type NonEmptyRoleArray = [Role, ...Role[]];

export const AuthAndGuard = (roles: NonEmptyRoleArray) => {
    
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard),
        ApiBearerAuth('access-token')
    );
}