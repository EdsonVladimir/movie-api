import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Client } from 'pg';
import { CreateUserDto } from '../dtos/user.dtos';

describe('UsersService', () => {
  let service: UsersService;
  let client: Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'PG',
          useValue: {
            query: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    client = module.get<Client>('PG');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
