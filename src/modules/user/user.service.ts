import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import appConfig from '../../config/app.config';
import { removeFields, toJSON } from '../../common/utils';

import { User } from './interfaces/user.interface';
import { UserDoc } from './interfaces/user-document.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDoc>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = bcrypt.hashSync(
        createUserDto.password,
        +appConfig().saltRounds,
      );

      const userCreated = await this.userModel.create(createUserDto as any);
      return await removeFields(toJSON(userCreated));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while registering user.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const userDocs = await this.userModel
        .find({ role: { $ne: 'admin' } })
        .exec();

      return await removeFields(toJSON(userDocs));
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting user list.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException('User not found.');

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while getting user by email ID.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getUserById(_id: number): Promise<User> {
    try {
      return this.userModel.findOne({ _id });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while verifying role.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
