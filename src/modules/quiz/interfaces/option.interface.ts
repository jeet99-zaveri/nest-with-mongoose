import { Question } from './question.interface';

export interface Option {
  _id: string;
  text: string;
  question: Question | string;
}
