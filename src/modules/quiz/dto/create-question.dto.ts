import { IsMongoId, IsNotEmpty, Length } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'Question must have some long text.' })
  @Length(10, 255)
  question: string;

  @IsNotEmpty()
  @IsMongoId()
  quiz: string;
}
