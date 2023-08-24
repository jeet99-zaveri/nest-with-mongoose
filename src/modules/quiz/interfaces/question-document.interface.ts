import { Document } from 'mongoose';
import { Quiz } from './quiz.interface';

export interface QuestionDoc extends Document {
  question: string;
  quiz: Quiz | string;
}
