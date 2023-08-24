import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuizSchema } from './schemas/quiz.schema';
import { QuestionSchema } from './schemas/question.schema';
import { OptionSchema } from './schemas/option.schema';

import { QuizController } from './controllers/quiz.controller';
import { QuestionController } from './controllers/question.controller';
import { OptionController } from './controllers/option.controller';

import { QuizService } from './services/quiz.service';
import { QuestionService } from './services/question.service';
import { OptionService } from './services/option.service';

import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Question', schema: QuestionSchema },
      { name: 'Option', schema: OptionSchema },
    ]),
    UserModule,
  ],
  controllers: [QuizController, QuestionController, OptionController],
  providers: [QuizService, QuestionService, OptionService],
  exports: [QuizService, QuestionService, OptionService],
})
export class QuizModule {}
