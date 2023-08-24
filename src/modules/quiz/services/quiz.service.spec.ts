import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';

import { QuizService } from './quiz.service';
import { Quiz } from '../interfaces/quiz.interface';
import { QuizDoc } from '../interfaces/quiz-document.interface';
import { removeFields } from '../../../common/utils';
import { createMock } from '@golevelup/ts-jest';

const mockQuiz = (
  _id = 'a uuid',
  title = 'Demo Quiz',
  description = 'Demo Description',
): Quiz => ({
  _id,
  title,
  description,
});

// still lazy, but this time using an object instead of multiple parameters
const mockQuizDoc = (mock?: Partial<Quiz>): Partial<QuizDoc> => ({
  _id: mock?._id || 'a uuid',
  title: mock?.title || 'Demo Quiz',
  description: mock?.description || 'Demo Description',
});

const quizArray = [
  mockQuiz(),
  mockQuiz('the king', 'Demo Quiz 1', 'Demo Description 1'),
  mockQuiz('a new uuid', 'Demo Quiz 2', 'Demo Description 2'),
];

const quizDocArray: Partial<QuizDoc>[] = [
  mockQuizDoc(),
  mockQuizDoc({
    _id: 'the king',
    title: 'Demo Quiz 1',
    description: 'Demo Description 1',
  }),
  mockQuizDoc({
    _id: 'a new uuid',
    title: 'Demo Quiz 2',
    description: 'Demo Description 2',
  }),
];

describe('QuizService', () => {
  let service: QuizService;
  let model: Model<QuizDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: getModelToken('Quiz'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockQuiz()),
            constructor: jest.fn().mockResolvedValue(mockQuiz()),
            find: jest.fn(),
            findOne: jest.fn(),
            // update: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            // exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
    model = module.get<Model<QuizDoc>>(getModelToken('Quiz'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new quiz', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve(
        removeFields({
          _id: 'some id',
          title: 'Demo Quiz Inserted 1',
          description: 'Demo Description Inserted 1',
        }),
      ),
    );

    const newQuiz = await service.create({
      title: 'Demo Quiz Inserted 1',
      description: 'Demo Description Inserted 1',
    });

    expect(newQuiz).toEqual(
      mockQuiz(
        'some id',
        'Demo Quiz Inserted 1',
        'Demo Description Inserted 1',
      ),
    );
  });

  it('should return all quizzes', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(quizDocArray),
    } as unknown as Query<QuizDoc[], QuizDoc>);
    const users = await service.findAll();
    expect(users).toEqual(quizArray);
  });

  it('should findOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<QuizDoc, QuizDoc>>({
        exec: jest.fn().mockResolvedValueOnce(
          mockQuizDoc({
            _id: 'some random id',
            title: 'Demo Quiz by ID',
            description: 'Demo Description by ID',
          }),
        ),
      }),
    );
    const findMockQuiz = mockQuiz(
      'some random id',
      'Demo Quiz by ID',
      'Demo Description by ID',
    );
    const foundQuiz = await service.findOne('some random id');
    expect(foundQuiz).toEqual(findMockQuiz);
  });

  it('should delete a quiz successfully', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(
      createMock<Query<QuizDoc, QuizDoc>>({
        exec: jest.fn().mockResolvedValueOnce(true as any),
      }),
    );
    const deleteQuiz = await service.remove('some id');
    expect(deleteQuiz).toEqual(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
