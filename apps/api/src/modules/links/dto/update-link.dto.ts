import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateLinkDto {
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  collectionId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
