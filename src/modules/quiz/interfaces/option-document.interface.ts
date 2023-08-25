import { Document } from 'mongoose';
import { Question } from './question.interface';

export interface OptionDoc extends Document {
  text: string;
  question: Question | string;
}
