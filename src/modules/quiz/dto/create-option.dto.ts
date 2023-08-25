import { IsMongoId, IsNotEmpty, Length } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty({ message: 'Text must have 2 or more characters.' })
  @Length(2, 255)
  text: string;

  @IsNotEmpty()
  @IsMongoId()
  question: string;
}
