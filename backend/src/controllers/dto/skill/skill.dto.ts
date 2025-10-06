// src/dto/skill.dto.ts
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty({ message: "Skill name is required" })
  @Length(3, 50, { message: "Skill name must be between 3 and 50 characters" })
  name!: string;

  @IsString()
  @IsOptional()
  @Length(0, 255, { message: "Description must not exceed 255 characters" })
  description?: string;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  @Length(3, 50, { message: "Skill name must be between 3 and 50 characters" })
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 255, { message: "Description must not exceed 255 characters" })
  description?: string;
}
