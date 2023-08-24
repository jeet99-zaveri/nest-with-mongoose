import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserDoc } from './interfaces/user-document.interface';
import { User } from './interfaces/user.interface';

const mockUser = (
  name = 'Jeet',
  _id = 'a uuid',
  email = 'jeet@gmail.com',
  role = 'user',
): User => ({
  name,
  _id,
  email,
  role,
});

// still lazy, but this time using an object instead of multiple parameters
const mockUserDoc = (mock?: Partial<User>): Partial<UserDoc> => ({
  name: mock?.name || 'Jeet',
  _id: mock?._id || 'a uuid',
  email: mock?.email || 'jeet@gmail.com',
  role: mock?.role || 'user',
});

const userArray = [
  mockUser(),
  mockUser('Preet', 'the king', 'preet@gmail.com', 'admin'),
  mockUser('Jiya', 'a new uuid', 'jiya@gmail.com', 'user'),
];

const userDocArray: Partial<UserDoc>[] = [
  mockUserDoc(),
  mockUserDoc({
    name: 'Preet',
    _id: 'the king',
    email: 'preet@gmail.com',
    role: 'admin',
  }),
  mockUserDoc({
    name: 'Jiya',
    email: 'jiya@gmail.com',
    _id: 'a new uuid',
    role: 'user',
  }),
];

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        // ApiServiceProvider,
        {
          provide: getModelToken('User'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            // findOne: jest.fn(),
            // update: jest.fn(),
            // create: jest.fn(),
            // remove: jest.fn(),
            // exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDoc>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(userDocArray),
    } as unknown as Query<UserDoc[], UserDoc>);
    const users = await service.findAll();
    expect(users).toEqual(userArray);
  });
});
