import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Client } from 'pg';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('MoviesService', () => {
  let service: MoviesService;
  let clientPg: Client;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: 'PG',
          useValue: {
            query: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockReturnValue(of({ data: {} })),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    clientPg = module.get<Client>('PG');
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
