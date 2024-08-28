/**
 *@autor Edson Sosa
 */
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Client } from 'pg';
import { User } from '../Entities/user.entity';
import { catchError, first, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUserDto } from '../dtos/user.dtos';

@Injectable()
export class UsersService {

  private readonly _NUMBER_ZERO: number = 0;

  constructor(@Inject('PG') private _clientPg: Client) {}

  public createUser(user: CreateUserDto): Observable<User> {
    const { name, email, password, id_role } = user;
    const query: string = `INSERT INTO core.user(name, email, password, id_role) VALUES ($1, $2, $3, $4) RETURNING name, email`;
    const values: Array<string | number> = [name, email, password, id_role];

    return from(this._clientPg.query(query, values)).pipe(
      map((result) => result.rows[this._NUMBER_ZERO]),
      catchError((error) => {
        console.log('Database error:', error);
        throw new InternalServerErrorException('Error al crear el registro');
      }),
      first(),
    );
  }
}
