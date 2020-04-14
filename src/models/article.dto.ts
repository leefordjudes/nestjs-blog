import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  body: string;
  
  @IsArray()
  @IsString({each: true})
  tagList: string[];

}

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  body: string;
  
  @IsArray()
  @IsString({each: true})
  @IsOptional()
  tagList: [string];
}

export interface FindFeedQuery {
  pageNumber?: number | 1;
  pageSize?: number | 25;
}

export interface FindAllQuery extends FindFeedQuery{
 tag?: string;
 author?: string;
 favoritedBy?: string;
}

