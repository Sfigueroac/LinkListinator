import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isPublic: boolean;
}
