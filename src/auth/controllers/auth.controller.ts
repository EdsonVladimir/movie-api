/**
 * @author Edson Sosa
 */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from '../dtos/auth.dtos';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request, @Body() payload: AuthDto) {
    return req.user;
  }
}
