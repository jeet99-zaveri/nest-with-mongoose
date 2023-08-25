import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { QuestionDoc } from '../interfaces/question-document.interface';
import { removeFields, toJSON } from '../../../common/utils';
import { OptionDoc } from '../interfaces/option-document.interface';
import { CreateOptionDto } from '../dto/create-option.dto';
import { Option } from '../interfaces/option.interface';

@Injectable()
export class OptionService {
  constructor(
    @InjectModel('Option') private readonly optionModel: Model<OptionDoc>,
    @InjectModel('Question') private readonly questionModel: Model<QuestionDoc>,
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    try {
      // const { question } = createOptionDto;

      // const checkQuestion = await this.questionModel.findOne({
      //   _id: question,
      //   isDeleted: { $ne: true },
      // });
      // if (!checkQuestion) {
      //   throw new HttpException(
      //     {
      //       status: HttpStatus.NOT_FOUND,
      //       error:
      //         'Mention question is not available. Please check and try again',
      //     },
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

      const createdOption = await this.optionModel.create(
        createOptionDto as any,
      );
      return removeFields(toJSON(createdOption));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while creating option.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(): Promise<Option[]> {
    try {
      const options = await this.optionModel
        .find({ isDeleted: { $ne: true } })
        .populate({ path: 'question', select: 'question' })
        .exec();

      if (!options.length) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No options found.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return await removeFields(toJSON(options));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting option list.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(_id: string): Promise<Option> {
    try {
      const option = await this.optionModel
        .findOne({ _id, isDeleted: { $ne: true } })
        .populate({ path: 'question', select: 'question' })
        .exec();

      if (!option) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No option found by ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return await removeFields(toJSON(option));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting option by ID.',
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
      const option = await this.optionModel
        .findOneAndUpdate(
          {
            _id,
            isDeleted: { $ne: true },
          },
          { $set: { isDeleted: true, deletedAt: Date.now() } },
          { new: true },
        )
        .exec();

      if (!option) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No option found for given ID.',
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
            'Something went wrong, while getting option by ID.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
