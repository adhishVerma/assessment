// dto/question.dto.ts
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Difficulty, Option } from "../../../../generated/prisma";

export class CreateQuestionDto {
  @IsInt({ message: "skillId must be a number" })
  skillId!: number;

  @IsString()
  @IsNotEmpty({ message: "Question text is required" })
  @Length(5, 255, { message: "Question must be between 5 and 255 characters" })
  questionText!: string;

  @IsString()
  @IsNotEmpty({ message: "Option A is required" })
  optionA!: string;

  @IsString()
  @IsNotEmpty({ message: "Option B is required" })
  optionB!: string;

  @IsString()
  @IsNotEmpty({ message: "Option C is required" })
  optionC!: string;

  @IsString()
  @IsNotEmpty({ message: "Option D is required" })
  optionD!: string;

  @IsEnum(Option, { message: "Correct option must be A, B, C, or D" })
  correctOption!: Option;

  @IsEnum(Difficulty, { message: "Difficulty must be EASY, MEDIUM, or HARD" })
  @IsOptional()
  difficulty?: Difficulty = Difficulty.MEDIUM;
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  @Length(5, 255)
  questionText?: string;

  @IsOptional()
  @IsString()
  optionA?: string;

  @IsOptional()
  @IsString()
  optionB?: string;

  @IsOptional()
  @IsString()
  optionC?: string;

  @IsOptional()
  @IsString()
  optionD?: string;

  @IsOptional()
  @IsEnum(Option)
  correctOption?: Option;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;
}
