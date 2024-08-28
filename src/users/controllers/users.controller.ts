/**
 *@autor Edson Sosa
 */
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/user.dtos';
import { User } from '../Entities/user.entity';
import { Observable } from 'rxjs';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private _usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'register user' })
  public createUser(@Body() payload: CreateUserDto): Observable<User> {
    return this._usersService.createUser(payload);
  }
}
