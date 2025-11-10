import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type JwtPayload = {
    sub: number;
    role: string;
};

declare module 'express' {
    interface Request {
        user?: JwtPayload;
    }
}

export const User = createParamDecorator(
    (data: JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | undefined => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const user = request.user;
        return user ? user : undefined;
    },
);

