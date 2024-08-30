/**
 * @author Edson Sosa
 */
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request) {
    return req.user;
  }
}
