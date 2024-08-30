/**
 * @author Edson Sosa
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { catchError, first, of, switchMap } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private _authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string) {
    return this._authService.validateUser(email, password).pipe(
      switchMap((user) => {
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
        return of(user);
      }),
      catchError((error) => {
        throw new UnauthorizedException(error.message);
      }),
      first()
    );
  }
}
