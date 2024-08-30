import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client } from 'pg';
import { Role } from '../Entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(@Inject('PG') private _clientPg: Client) {
  }

  public async getAllRoles(): Promise<Role[]> {
    const query = 'SELECT id_role, name, code from core.role';
    try {
      const result = await this._clientPg.query(query);

      return result.rows;
    } catch (error) {
      console.error('Database error', error);
      throw new InternalServerErrorException(error);
    }
  }
}
