import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model, Query } from 'mongoose';

import { QuizService } from './quiz.service';
import { removeFields } from '../../../common/utils';
import { createMock } from '@golevelup/ts-jest';
import { Question } from '../interfaces/question.interface';
import { QuestionDoc } from '../interfaces/question-document.interface';
import { QuestionService } from './question.service';

const mockQuestion = (
  _id = 'a uuid',
  question = 'Demo Question',
  quiz = {
    _id: 'the king',
    title: 'Demo Quiz 1',
    description: 'Demo Description 1',
  }, // 64e7076867ec7336769540f3
): Question => ({
  _id,
  question,
  quiz,
});

const mockQuestionDoc = (mock?: Partial<Question>): Partial<QuestionDoc> => ({
  _id: mock?._id || 'a uuid',
  question: mock?.question || 'Demo Question',
  quiz: mock?.quiz || {
    _id: 'the king',
    title: 'Demo Quiz 1',
    description: 'Demo Description 1',
  },
});

const questionArray = [
  mockQuestion(),
  mockQuestion('the king', 'Demo Question 1', {
    _id: 'some ID',
    title: 'Demo Quiz 2',
    description: 'Demo Description 2',
  }),
  mockQuestion('a new uuid', 'Demo Question 2', {
    _id: 'some ID 2',
    title: 'Demo Quiz 1',
    description: 'Demo Description 1',
  }),
];

const questionDocArray: Partial<QuestionDoc>[] = [
  mockQuestionDoc(),
  mockQuestionDoc({
    _id: 'the king',
    question: 'Demo Question 1',
    quiz: {
      _id: 'some ID',
      title: 'Demo Quiz 2',
      description: 'Demo Description 2',
    },
  }),
  mockQuestionDoc({
    _id: 'a new uuid',
    question: 'Demo Question 2',
    quiz: {
      _id: 'some ID 2',
      title: 'Demo Quiz 1',
      description: 'Demo Description 1',
    },
  }),
];

describe('QuestionService', () => {
  let service: QuestionService;
  let model: Model<QuestionDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        QuizService,
        {
          provide: getModelToken('Question'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockQuestion()),
            constructor: jest.fn().mockResolvedValue(mockQuestion()),
            find: jest.fn(),
            findOne: jest.fn(),
            // update: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            // exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Quiz'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            // update: jest.fn(),
            findOneAndUpdate: jest.fn(),
            // exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    model = module.get<mongoose.Model<QuestionDoc>>(getModelToken('Question'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new question', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve(
        removeFields({
          _id: 'some id',
          question: 'Demo Question Inserted 1',
          quiz: '64e7140f533ae455196fff51',
        }),
      ),
    );

    const newQuestion = await service.create({
      question: 'Demo Question Inserted 1',
      quiz: '64e7140f533ae455196fff51',
    });

    expect(newQuestion).toEqual({
      _id: 'some id',
      question: 'Demo Question Inserted 1',
      quiz: '64e7140f533ae455196fff51',
    });
  });

  it('should return all questions', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(questionDocArray),
    } as unknown as Query<QuestionDoc[], QuestionDoc>);
    const users = await service.findAll();
    expect(users).toEqual(questionArray);
  });

  it('should findOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<QuestionDoc, QuestionDoc>>({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(
          mockQuestionDoc({
            _id: '64e73d4344e3227caa56de0b',
            question: 'Demo Question 1',
            quiz: {
              _id: 'the king',
              title: 'Demo Quiz 1',
              description: 'Demo Description 1',
            },
          }),
        ),
      }),
    );
    const findMockQuestion = mockQuestion(
      '64e73d4344e3227caa56de0b',
      'Demo Question 1',
      {
        _id: 'the king',
        title: 'Demo Quiz 1',
        description: 'Demo Description 1',
      },
    );
    const foundQuestion = await service.findOne('64e73d4344e3227caa56de0b');
    expect(foundQuestion).toEqual(findMockQuestion);
  });

  it('should delete a quiz successfully', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(
      createMock<Query<QuestionDoc, QuestionDoc>>({
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
