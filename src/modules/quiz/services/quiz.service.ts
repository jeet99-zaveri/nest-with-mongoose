import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';

import { QuizDoc } from '../interfaces/quiz-document.interface';
import { Quiz } from '../interfaces/quiz.interface';
import { removeFields, toJSON } from '../../../common/utils';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<QuizDoc>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      const createdQuiz = await this.quizModel.create(createQuizDto as any);
      return removeFields(toJSON(createdQuiz));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while creating quiz.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(): Promise<Quiz[]> {
    try {
      const quizzes = await this.quizModel
        .find({ isDeleted: { $ne: true } })
        .exec();

      if (!quizzes.length) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No quizzes found.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return await removeFields(toJSON(quizzes));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting quiz list.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(_id: string): Promise<Quiz> {
    try {
      const quiz = await this.quizModel
        .findOne({ _id, isDeleted: { $ne: true } })
        .exec();

      if (!quiz) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No quiz found by ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return await removeFields(toJSON(quiz));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting quiz by ID.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  async remove(_id: string): Promise<boolean> {
    try {
      const quiz = await this.quizModel
        .findOneAndUpdate(
          {
            _id,
            isDeleted: { $ne: true },
          },
          { $set: { isDeleted: true, deletedAt: Date.now() } },
          { new: true },
        )
        .exec();

      if (!quiz) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No quiz found for given ID.',
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
            'Something went wrong, while getting quiz by ID.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
