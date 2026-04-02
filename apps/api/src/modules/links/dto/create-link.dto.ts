import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  url: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  collectionId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
