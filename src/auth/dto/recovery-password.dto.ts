import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RecoveryPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  recoveryCode: string;
}
