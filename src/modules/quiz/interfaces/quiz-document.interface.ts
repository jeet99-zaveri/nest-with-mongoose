import { Document } from 'mongoose';

export interface QuizDoc extends Document {
  title: string;
  description: string;
}
