import { Quiz } from './quiz.interface';

export interface Question {
  _id: string;
  question: string;
  quiz: Quiz | string;
}
