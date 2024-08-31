import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthDto } from '../dtos/auth.dtos';
import { User } from '../../users/Entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser: User = {
    id_user: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    id_role: 1
  };

  const mockAuthService = {
    generateJWT: jest.fn().mockReturnValue({ access_token: 'token', user: mockUser })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        JwtService
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería estar definido', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('debería retornar un token JWT y la información del usuario', async () => {
      const req = {
        user: mockUser
      } as Partial<Request>;

      const payload: AuthDto = {
        email: 'test@example.com',
        password: 'password'
      };

      const result = await authController.login(req as Request, payload);

      expect(result).toEqual({ access_token: 'token', user: mockUser });
      expect(authService.generateJWT).toHaveBeenCalledWith(mockUser);
    });
  });
});
