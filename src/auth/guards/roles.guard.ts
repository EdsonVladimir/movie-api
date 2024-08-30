/**
 * @author Edson Sosa
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';
import { Role } from '../models/roles.model';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private _reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this._reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: PayloadToken = request.user as PayloadToken;
    const isAuth: boolean = roles.some((role) => role === Number(user.role));

    if (!isAuth) {
      throw new UnauthorizedException('your role is wrong');
    }

    return isAuth;
  }
}
