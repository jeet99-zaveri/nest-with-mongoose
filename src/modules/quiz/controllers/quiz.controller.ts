import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { SETTINGS } from '../../../app.utils';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorators';
import { ResponseInterface, response } from '../../../common/response';
import { JwtAuthGuard } from '../../../modules/auth/jwt.auth.guard';

@Controller('quiz')
// @UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  // @UsePipes(SETTINGS.VALIDATION_PIPE)
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  async create(
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<ResponseInterface> {
    try {
      const createdQuiz = await this.quizService.create(createQuizDto);

      return response(
        HttpStatus.CREATED,
        'Quiz created successfully.',
        createdQuiz,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while creating quiz',
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
      const quizzes = await this.quizService.findAll();
      return response(HttpStatus.OK, 'Get quiz list successfully.', quizzes);
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseInterface> {
    try {
      const quiz = await this.quizService.findOne(id);
      return response(HttpStatus.OK, 'Get quiz by ID successfully.', quiz);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const quiz = await this.quizService.remove(id);
      if (!quiz) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Something went wrong, while deleting quiz.',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return response(HttpStatus.OK, 'Delete quiz successfully.');
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while deleting quiz.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
