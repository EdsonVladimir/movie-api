/**
 *@autor Edson Sosa
 */
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Client, QueryResult } from 'pg';
import { User } from '../Entities/user.entity';
import { CreateUserDto } from '../dtos/user.dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly _NUMBER_HASH: number = 10;
  private readonly _NUMBER_ZERO: number = 0;

  constructor(@Inject('PG') private _clientPg: Client) {
  }

  public async createUser(user: CreateUserDto): Promise<User> {
    const { name, email, password, id_role } = user;
    const query: string = `INSERT INTO core.user(name, email, password, id_role) VALUES ($1, $2, $3, $4) RETURNING name, email`;

    try {
      const imalExist: User = await this.findByEmail(email);

      if (imalExist) {
        throw new ConflictException(`this email ${email} already exists`);
      }

      const hashedPassword: string = await bcrypt.hash(
        password,
        this._NUMBER_HASH
      );
      const values: Array<string | number> = [
        name,
        email,
        hashedPassword,
        id_role
      ];
      const result: QueryResult = await this._clientPg.query(query, values);

      return result.rows[this._NUMBER_ZERO];
    } catch (error) {
      console.error('Database error', error);
      throw new InternalServerErrorException(error);
    }
  }

  public async findAll(): Promise<User[]> {
    const query: string = `SELECT a.id_user, a.name, a.email, b.name as role  FROM core.user a INNER JOIN core.role b ON a.id_role = b.id_role`;

    try {
      const result: QueryResult = await this._clientPg.query(query);

      return result.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new InternalServerErrorException(error);
    }
  }

  public async findOne(id: number): Promise<User> {
    const query: string = `SELECT a.id_user, a.name, a.email, b.name as role  FROM core.user a INNER JOIN core.role b ON a.id_role = b.id_role WHERE a.id_user = $1`;

    try {
      const result: QueryResult = await this._clientPg.query(query, [id]);

      return result.rows[this._NUMBER_ZERO];
    } catch (error) {
      console.error('Database Error:', error);
      throw new InternalServerErrorException(error);
    }
  }

  public async findByEmail(email: string): Promise<User> {
    const query: string = `SELECT name, email, id_role, password  FROM core.user WHERE email = $1`;

    try {
      const result: QueryResult = await this._clientPg.query(query, [email]);

      return result.rows[this._NUMBER_ZERO];
    } catch (error) {
      console.error('Database error', error);
      throw new InternalServerErrorException(error);
    }
  }
}
