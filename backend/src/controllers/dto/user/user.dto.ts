// dto/user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @Length(2, 50, { message: "Name must be between 2 and 50 characters" })
  name!: string;

  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 100, { message: "Password must be at least 6 characters long" })
  password!: string;
}

export class LoginUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
