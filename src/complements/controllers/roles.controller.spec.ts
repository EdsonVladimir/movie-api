import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from '../services/roles.service';
import { Role } from '../Entities/roles.entity';

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            getAllRoles: jest.fn().mockResolvedValue([
              {
                id_role: 1,
                name: 'ADMIN',
                code: 'ADM',
              },
              {
                id_role: 2,
                name: 'CUSTOM',
                code: 'CTM',
              },
            ]),
          },
        },
      ],
    }).compile();

    rolesController = moduleRef.get<RolesController>(RolesController);
    rolesService = moduleRef.get<RolesService>(RolesService);
  });

  describe('getAllRoles', () => {
    it('se supone que debe devolver un array de Roles', async () => {
      const result: Role[] = [
        {
          id_role: 1,
          name: 'ADMIN',
          code: 'ADM',
        },
      ];

      jest.spyOn(rolesService, 'getAllRoles').mockResolvedValue(result);

      expect(await rolesController.getAllRoles()).toBe(result);
    });
  });
});
