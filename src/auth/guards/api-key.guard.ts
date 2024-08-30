/**
 * @autor Edson Sosa
 */
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigType } from '@nestjs/config';
import config from '../../config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(config.KEY) private _configService: ConfigType<typeof config>,
    private _reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = this._reflector.get(
      IS_PUBLIC_KEY,
      context.getHandler()
    );

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader: string = request.header('Auth');
    const isAuth: boolean = authHeader === this._configService.apiKey;

    if (!isAuth) {
      throw new UnauthorizedException('Not allow');
    }

    return isAuth;
  }
}
