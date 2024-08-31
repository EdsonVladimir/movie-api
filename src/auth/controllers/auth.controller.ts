/**
 * @author Edson Sosa
 */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from '../dtos/auth.dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { User } from '../../users/Entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {
  }

  @Post('login')
  @ApiOperation({ summary: '* Endpoint para login de usuarios y obtención de token de acceso.' })
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request, @Body() payload: AuthDto) {
    const user = req.user as User;
    return this._authService.generateJWT(user);
  }
}
