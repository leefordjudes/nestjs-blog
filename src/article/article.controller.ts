import { Controller, Get, Param, Post, UseGuards, Body, ValidationPipe, Put, Delete, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './../auth/user.decorator';
import { User } from './../models/user.model';
import { CreateArticleDto, UpdateArticleDto, FindAllQuery, FindFeedQuery } from './../models/article.dto';
import { OptionalAuthGuard } from './../auth/optional-auth.gaurd';
import { SharedService } from 'src/shared/shared.service';

@Controller('article')
export class ArticleController {

  constructor(
    private articleService: ArticleService,
    private sharedService: SharedService,
    ){}

  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(@AuthUser() user: User, @Query() query: FindAllQuery) {
    const articles = await this.articleService.findAll(user, query);
    return {articles, articleCount: articles.length};
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@AuthUser() user: User, @Query() query: FindFeedQuery) {
    // return await this.articleService.findFeed(user, query);
    const articles = await this.articleService.findFeed(user, query);
    return {articles, articleCount: articles.length};
  }

  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @AuthUser() user?: User) {
    const article:any = await this.articleService.findBySlug(slug,user);
    return {article};
  }

  @Post()
  @UseGuards(AuthGuard())
  async createArticle(@AuthUser() user: User, @Body(ValidationPipe) data: CreateArticleDto) {
    const article = await this.articleService.createArticle(user, data);
    return { article };
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(@Param('slug') slug: string, @AuthUser() authUser: User, @Body(ValidationPipe) data: UpdateArticleDto) {
    const article = await this.articleService.updateArticle(slug, authUser, data);
    return {article};
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@Param('slug') slug: string, @AuthUser() authUser: User) {
    const article = await this.articleService.deleteArticle(slug, authUser);
    return {article};
  }

}
