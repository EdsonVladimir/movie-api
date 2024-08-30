/**
 * @author Edson Sosa
 */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { catchError, first, from, Observable, of, switchMap } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/Entities/user.entity';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser(
    email: string,
    password: string,
  ): Observable<{ access_token: string; user: User }> {
    return from(this._usersService.findByEmail(email)).pipe(
      switchMap((user: User) => {
        if (!user) {
          return of(null);
        }

        return from(bcrypt.compare(password, user.password)).pipe(
          switchMap((isMatch) => {
            if (isMatch) {
              const { password, ...userWithoutPassword } = user;
              return of(this.generateJWT(userWithoutPassword));
            } else {
              return of(null);
            }
          }),
          catchError((error) => {
            console.error('Error comparing passwords:', error);
            throw new InternalServerErrorException(
              'Error comparing passwords:',
            );
          }),
          first(),
        );
      }),
      catchError((error) => {
        console.error('Error finding user:', error);
        throw new InternalServerErrorException('Error finding user');
      }),
      first(),
    );
  }

  generateJWT(user: any) {
    const payload: PayloadToken = { role: user.id_role, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }
}
