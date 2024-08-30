/**
 * @autor Edson Sosa
 */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/user.dtos';
import { User } from '../Entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { RolesGuard } from '../../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private _usersService: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'register user' })
  private createUser(@Body() payload: CreateUserDto): Promise<User> {
    return this._usersService.createUser(payload);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'get all users' })
  private getUsers(): Promise<User[]> {
    return this._usersService.findAll();
  }

  @Post('email')
  private verifyUser(): Promise<User> {
    return this._usersService.findByEmail('sara@gmail.com');
  }
}
