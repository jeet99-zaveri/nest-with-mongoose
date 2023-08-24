import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateQuestionDto } from '../dto/create-question.dto';

import { QuestionDoc } from '../interfaces/question-document.interface';
import { Question } from '../interfaces/question.interface';
import { removeFields, toJSON } from '../../../common/utils';
import { QuizDoc } from '../interfaces/quiz-document.interface';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<QuestionDoc>,
    @InjectModel('Quiz') private readonly quizModel: Model<QuizDoc>,
  ) {}

  async create(createdQuestionDto: CreateQuestionDto): Promise<Question> {
    try {
      const { quiz } = createdQuestionDto;

      // const checkQuiz = await this.quizModel.findOne({
      //   _id: quiz,
      //   isDeleted: { $ne: true },
      // });
      // if (!checkQuiz) {
      //   throw new HttpException(
      //     {
      //       status: HttpStatus.NOT_FOUND,
      //       error: 'Mention quiz is not available. Please check and try again',
      //     },
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

      const createdQuestion = await this.questionModel.create(
        createdQuestionDto as any,
      );
      return removeFields(toJSON(createdQuestion));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while creating question.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(): Promise<Question[]> {
    try {
      const questions = await this.questionModel
        .find({ isDeleted: { $ne: true } })
        .populate({ path: 'quiz', select: 'title description' })
        .exec();

      if (!questions.length) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No question found.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return await removeFields(toJSON(questions));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting question list.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(_id: string): Promise<Question> {
    try {
      const question = await this.questionModel
        .findOne({ _id, isDeleted: { $ne: true } })
        .populate({ path: 'quiz', select: 'title description' })
        .exec();

      if (!question) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No question found by ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return await removeFields(toJSON(question));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting question by ID.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
  async remove(_id: string): Promise<boolean> {
    try {
      const question = await this.questionModel
        .findOneAndUpdate(
          {
            _id,
            isDeleted: { $ne: true },
          },
          { $set: { isDeleted: true, deletedAt: Date.now() } },
          { new: true },
        )
        .exec();

      if (!question) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No question found for given ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return true;
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting question by ID.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
