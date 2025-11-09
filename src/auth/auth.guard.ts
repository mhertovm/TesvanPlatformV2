import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.jwtPayload.decorator';
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), //get endpoint decorator
      context.getClass(), //get controller decorator
    ]);

    const request = context.switchToHttp().getRequest() as Request;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Do not token");
    };

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: 'your_jwt_secret'
        }
      )

      if (!roles.includes(payload.role)) {
        throw new UnauthorizedException();
      };

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = { sub: payload.sub, role: payload.role } as JwtPayload;
    } catch {
      throw new UnauthorizedException("3");
    };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    };
    return authHeader.split(' ')[1];
  }
}
