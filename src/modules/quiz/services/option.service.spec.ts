import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model, Query } from 'mongoose';

import { removeFields } from '../../../common/utils';
import { createMock } from '@golevelup/ts-jest';
import { QuestionService } from './question.service';
import { Option } from '../interfaces/option.interface';
import { OptionDoc } from '../interfaces/option-document.interface';
import { OptionService } from './option.service';
import { QuizService } from './quiz.service';

const mockOption = (
  _id = 'a uuid',
  text = 'Demo Option',
  question = {
    _id: 'the king',
    question: 'Demo question 1',
    quiz: '64e7076867ec7336769540f3',
  },
): Option => ({
  _id,
  text,
  question,
});

const mockOptionDoc = (mock?: Partial<Option>): Partial<OptionDoc> => ({
  _id: mock?._id || 'a uuid',
  text: mock?.text || 'Demo Option',
  question: mock?.question || {
    _id: 'the king',
    question: 'Demo question 1',
    quiz: '64e7076867ec7336769540f3',
  },
});

const optionArray = [
  mockOption(),
  mockOption('the king', 'Demo Option 1', {
    _id: 'some ID',
    question: 'Demo Question 2',
    quiz: '64e7076867ec7336769540f3',
  }),
  mockOption('a new uuid', 'Demo Option 2', {
    _id: 'some ID 2',
    question: 'Demo Question 1',
    quiz: '64e7076867ec7336769540f4',
  }),
];

const optionDocArray: Partial<OptionDoc>[] = [
  mockOptionDoc(),
  mockOptionDoc({
    _id: 'the king',
    text: 'Demo Option 1',
    question: {
      _id: 'some ID',
      question: 'Demo Question 2',
      quiz: '64e7076867ec7336769540f3',
    },
  }),
  mockOptionDoc({
    _id: 'a new uuid',
    text: 'Demo Option 2',
    question: {
      _id: 'some ID 2',
      question: 'Demo Question 1',
      quiz: '64e7076867ec7336769540f4',
    },
  }),
];

describe('OptionService', () => {
  let service: OptionService;
  let model: Model<OptionDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionService,
        QuestionService,
        QuizService,
        {
          provide: getModelToken('Option'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockOption()),
            constructor: jest.fn().mockResolvedValue(mockOption()),
            find: jest.fn(),
            findOne: jest.fn(),
            // update: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            // exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Question'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            // update: jest.fn(),
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

    service = module.get<OptionService>(OptionService);
    model = module.get<mongoose.Model<OptionDoc>>(getModelToken('Option'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new option', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve(
        removeFields({
          _id: 'some id',
          text: 'Demo Option Inserted 1',
          question: '64e7140f533ae455196fff51',
        }),
      ),
    );

    const newOption = await service.create({
      text: 'Demo Option Inserted 1',
      question: '64e7140f533ae455196fff51',
    });

    expect(newOption).toEqual({
      _id: 'some id',
      text: 'Demo Option Inserted 1',
      question: '64e7140f533ae455196fff51',
    });
  });

  it('should return all options', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(optionDocArray),
    } as unknown as Query<OptionDoc[], OptionDoc>);
    const options = await service.findAll();
    expect(options).toEqual(optionArray);
  });

  it('should findOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<OptionDoc, OptionDoc>>({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(
          mockOptionDoc({
            _id: '64e73d4344e3227caa56de0b',
            text: 'Demo Option 1',
            question: {
              _id: 'the king',
              question: 'Demo Question 1',
              quiz: '64e7076867ec7336769540f3',
            },
          }),
        ),
      }),
    );
    const findMockOption = mockOption(
      '64e73d4344e3227caa56de0b',
      'Demo Option 1',
      {
        _id: 'the king',
        question: 'Demo Question 1',
        quiz: '64e7076867ec7336769540f3',
      },
    );
    const foundOption = await service.findOne('64e73d4344e3227caa56de0b');
    expect(foundOption).toEqual(findMockOption);
  });

  it('should delete a option successfully', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(
      createMock<Query<OptionDoc, OptionDoc>>({
        exec: jest.fn().mockResolvedValueOnce(true as any),
      }),
    );
    const deleteOption = await service.remove('some id');
    expect(deleteOption).toEqual(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
