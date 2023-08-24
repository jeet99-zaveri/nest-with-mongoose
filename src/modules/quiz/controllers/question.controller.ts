import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionService } from '../services/question.service';
import { SETTINGS } from '../../../app.utils';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorators';
import { ResponseInterface, response } from '../../../common/response';
import { JwtAuthGuard } from '../../../modules/auth/jwt.auth.guard';

@Controller('question')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UsePipes(SETTINGS.VALIDATION_PIPE)
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<ResponseInterface> {
    try {
      const createdQuestion = await this.questionService.create(
        createQuestionDto,
      );

      return response(
        HttpStatus.CREATED,
        'Question created successfully.',
        createdQuestion,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while creating question',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  async findAll(): Promise<ResponseInterface> {
    try {
      const questions = await this.questionService.findAll();
      return response(
        HttpStatus.OK,
        'Get question list successfully.',
        questions,
      );
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseInterface> {
    try {
      const question = await this.questionService.findOne(id);
      return response(
        HttpStatus.OK,
        'Get question by ID successfully.',
        question,
      );
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const question = await this.questionService.remove(id);
      if (!question) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Something went wrong, while deleting question.',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return response(HttpStatus.OK, 'Delete question successfully.');
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while deleting question.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
