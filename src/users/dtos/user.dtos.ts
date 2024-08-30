/**
 * @autor Edosn Sosa
 */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly id_role: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
