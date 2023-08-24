import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpStatus } from '@nestjs/common';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { name: 'Test User', email: 'Test Email', role: 'Test Role' },
              {
                name: 'Test User 2',
                email: 'Test Email 2',
                role: 'Test Role 2',
              },
              {
                name: 'Test User 3',
                email: 'Test Email 3',
                role: 'Test Role 3',
              },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should get an array of users', () => {
      expect(controller.findAll()).resolves.toEqual({
        status: HttpStatus.OK,
        message: 'Get users successfully.',
        data: [
          { name: 'Test User', email: 'Test Email', role: 'Test Role' },
          {
            name: 'Test User 2',
            email: 'Test Email 2',
            role: 'Test Role 2',
          },
          {
            name: 'Test User 3',
            email: 'Test Email 3',
            role: 'Test Role 3',
          },
        ],
        error: null,
      });
    });
  });
});
