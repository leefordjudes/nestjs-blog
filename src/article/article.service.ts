import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { classToPlain } from 'class-transformer';
import { User } from './../models/user.model';
import { Article } from './../models/article.model';
import { CreateArticleDto, UpdateArticleDto, FindAllQuery, FindFeedQuery } from './../models/article.dto';
import { SharedService } from './../shared/shared.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Article') private readonly articleModel: Model<Article>,
    private readonly sharedService: SharedService
  ){}

  async findAll(user: User, query: FindAllQuery) {
    return await this.articleModel.find({});
  }

  async findFeed(user: User, query: FindFeedQuery) {
    const {followers} = await this.userModel.findOne({_id: user.id},{followers:1});
    const ids = followers.map(follower=>{return follower});
    query.pageNumber = (query.pageNumber-1 <= 0 ) ? 0 : +query.pageNumber-1;
    query.pageSize = (query.pageSize <= 0 ) ? 25 : +query.pageSize;
    return await this.articleModel.find({'author.id': {$in: ids},}).skip((+query.pageNumber)*(+query.pageSize)).limit(+query.pageSize);
  }

  async findBySlug(slug: string, user?:User) {
    const article = await this.articleModel.findOne({slug});
    if (article) {
      let isFavorited: boolean | null;
      if(user) {
        isFavorited = article.favoritedBy.includes(user.id);
      }
      return await this.sharedService.toArticle(article, isFavorited);
    } 
    throw new NotFoundException(`article ${slug} was not found`);
  }

  private ensureOwnership(user: User, article: Article): boolean {
    return article.author.id === user.id;
  }

  async createArticle(user: User, data: CreateArticleDto) {
    let article = await this.articleModel.create(data);
    article.slug = await this.sharedService.generateSlug(article.title);
    console.log(user);
    article.author = user;
    article.author.id = user.id;
    article.author.username = user.username;
    article.author.isFollowed = user.followers.length > 0;
    await article.save();
    return await this.sharedService.toArticle(article);
  }

  async updateArticle(slug: string, authUser: User, data: UpdateArticleDto) {
    const article: any = await this.findBySlug(slug);
    if(article.author.id !== authUser.id) {
      throw new UnauthorizedException();
    }
    await this.articleModel.updateOne({slug}, data);
    return await this.sharedService.toArticle(article);
  }

  async deleteArticle(slug: string, authUser: User) {
    const article:any = await this.findBySlug(slug);
    if(article.author.id !== authUser.id) {
      throw new UnauthorizedException();
    }
    const result = await this.articleModel.remove(article);
    return result.deletedCount === 1 ? `article ${slug} is deleted.`: `Oops! something went wrong, article ${slug} is not deleted.`;
  }
}
