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

  async validateUser(email: string, password: string) {
    const user = await this._usersService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...rta } = user;
        return rta;
      }
    }
    return null;
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.id_role, sub: user.id_user };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
