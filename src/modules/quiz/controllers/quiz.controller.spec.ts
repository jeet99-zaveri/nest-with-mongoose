import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { QuizController } from './quiz.controller';

import { QuizService } from '../services/quiz.service';

import { CreateQuizDto } from '../dto/create-quiz.dto';

import { JwtAuthGuard } from '../../../modules/auth/jwt.auth.guard';
import { User } from '../../../modules/user/interfaces/user.interface';

import { USER_ROLES } from '../../../common/enum';
import { RolesGuard } from '../../../modules/auth/roles.guard';

// class MockJwtAuthGuard extends JwtAuthGuard {
//   canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const user: User = {
//       _id: '1',
//       email: 'jeet@gmail.com',
//       name: 'Jeet',
//       role: USER_ROLES.ADMIN,
//     }; // Mock user object
//     request.user = user; // Set the user in the request

//     return true;
//   }
// }

describe('QuizController', () => {
  let controller: QuizController;
  // let service: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        // { provide: JwtAuthGuard, useClass: MockJwtAuthGuard },
        // RolesGuard,
        // Reflector,
        {
          provide: QuizService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                _id: 'some id 1',
                title: 'Demo Quiz Inserted 1',
                description: 'Demo Description Inserted 1',
              },
              {
                _id: 'some id 2',
                title: 'Demo Quiz Inserted 2',
                description: 'Demo Description Inserted 2',
              },
              {
                _id: 'some id 3',
                title: 'Demo Quiz Inserted 3',
                description: 'Demo Description Inserted 3',
              },
            ]),
            create: jest
              .fn()
              .mockImplementation((quizDto: CreateQuizDto) =>
                Promise.resolve({ _id: 'a uuid', ...quizDto }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
    // service = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQuizzes', () => {
    it('should get an array of users', () => {
      expect(controller.findAll()).resolves.toEqual({
        status: HttpStatus.OK,
        message: 'Get quiz list successfully.',
        data: [
          {
            _id: 'some id 1',
            title: 'Demo Quiz Inserted 1',
            description: 'Demo Description Inserted 1',
          },
          {
            _id: 'some id 2',
            title: 'Demo Quiz Inserted 2',
            description: 'Demo Description Inserted 2',
          },
          {
            _id: 'some id 3',
            title: 'Demo Quiz Inserted 3',
            description: 'Demo Description Inserted 3',
          },
        ],
        error: null,
      });
    });
  });

  describe('Create Quiz', () => {
    it('should create a new quiz', () => {
      const newQuizDTO: CreateQuizDto = {
        title: 'Demo Quiz Inserted 1',
        description: 'Demo Description Inserted 1',
      };
      expect(controller.create(newQuizDTO)).resolves.toEqual({
        status: HttpStatus.CREATED,
        message: 'Quiz created successfully.',
        data: {
          _id: 'a uuid',
          ...newQuizDTO,
        },
        error: null,
      });
    });
  });
});
