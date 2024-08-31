import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/Entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id_user: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    id_role: 1
  } as User;

  const mockUsersService = {
    findByEmail: jest.fn().mockResolvedValue(mockUser)
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('debería retornar los datos del usuario sin la contraseña si la validación es exitosa', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(Promise.resolve(true) as unknown as never);

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id_user: 1, email: 'test@example.com', id_role: 1 });
    });

    it('debería retornar null si el usuario no se encuentra', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      const result = await authService.validateUser('notfound@example.com', 'password');
      expect(result).toBeNull();
    });

    it('debería retornar null si la contraseña no coincide', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(Promise.resolve(false) as unknown as never);

      const result = await authService.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('generateJWT', () => {
    it('debería retornar un access_token y los datos del usuario', () => {
      const result = authService.generateJWT(mockUser);

      expect(result).toEqual({
        access_token: 'token',
        user: mockUser
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ role: 1, sub: 1 });
    });
  });
});
