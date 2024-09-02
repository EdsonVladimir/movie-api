import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { Test } from '@nestjs/testing';
import { User } from '../Entities/user.entity';

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                email: 'edson@gmail.com',
                id_user: 1,
                role: 'ADMIN',
                name: 'Edson Sosa',
              },
            ]),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UsersService>(UsersService);
    userController = moduleRef.get<UsersController>(UsersController);
  });

  describe('getUsers', () => {
    it('se supone que debe devolver un array de usuarios', async () => {
      const result: User[] = [
        {
          email: 'edson@gmail.com',
          id_user: 1,
          role: 'ADMIN',
          name: 'Edson Sosa',
        },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(await userController.getUsers()).toBe(result);
    });
  });
});
