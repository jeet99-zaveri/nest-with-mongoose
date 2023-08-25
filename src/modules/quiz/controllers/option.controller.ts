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
import { SETTINGS } from '../../../app.utils';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorators';
import { ResponseInterface, response } from '../../../common/response';
import { JwtAuthGuard } from '../../../modules/auth/jwt.auth.guard';
import { OptionService } from '../services/option.service';
import { CreateOptionDto } from '../dto/create-option.dto';

@Controller('option')
@UseGuards(JwtAuthGuard)
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @UsePipes(SETTINGS.VALIDATION_PIPE)
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(
    @Body() createOptionDto: CreateOptionDto,
  ): Promise<ResponseInterface> {
    try {
      const createdOption = await this.optionService.create(createOptionDto);

      return response(
        HttpStatus.CREATED,
        'Option created successfully.',
        createdOption,
      );
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

  @Get()
  async findAll(): Promise<ResponseInterface> {
    try {
      const options = await this.optionService.findAll();
      return response(HttpStatus.OK, 'Get option list successfully.', options);
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseInterface> {
    try {
      const option = await this.optionService.findOne(id);
      return response(HttpStatus.OK, 'Get option by ID successfully.', option);
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const option = await this.optionService.remove(id);
      if (!option) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Something went wrong, while deleting option.',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return response(HttpStatus.OK, 'Delete option successfully.');
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.FORBIDDEN,
          error:
            error?.response?.error ??
            'Something went wrong, while deleting option.',
        },
        error?.response?.status ?? HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
