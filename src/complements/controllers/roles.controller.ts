import { Controller, Get } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Complements')
@Controller('roles')
export class RolesController {
  constructor(private _rolesService: RolesService) {}

  @ApiOperation({ summary: 'get registered roles' })
  @Get()
  public getAllRoles() {
    return this._rolesService.getAllRoles();
  }
}
