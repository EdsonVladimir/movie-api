/**
 * @author Edson Sosa
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  episode_id?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  opening_crawl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  director?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  producer?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  species?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  starships?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  vehicles?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  characters?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  planets?: string[];
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
export class DeleteMovieDto extends PartialType(CreateMovieDto) {}