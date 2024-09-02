/**
 * @autor Edson Sosa
 */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/user.dtos';
import { User } from '../Entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { RolesGuard } from '../../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private _usersService: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: '* Endpoint para registro de nuevos usuarios.' })
  public createUser(@Body() payload: CreateUserDto): Promise<User> {
    return this._usersService.createUser(payload);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'get all users | Necesita token de usuario Admin' })
  public getUsers(): Promise<User[]> {
    return this._usersService.findAll();
  }
}
