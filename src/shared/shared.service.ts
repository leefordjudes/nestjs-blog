import { Injectable } from '@nestjs/common';
import * as slug from 'slug';
import { Article } from './../models/article.model';
import { User } from 'src/models/user.model';

@Injectable()
export class SharedService {

  async toJSON(model: any){
    return await JSON.parse(JSON.stringify(model));
  }

  async generateSlug(title: string) {
    return slug(title, {lower:true}) + '-'+((Math.random() * Math.pow(36,6)) | 0).toString(36);
  }

  async toArticle(currentArticle: Article, isFavorited?: boolean) {
    const article:any = await this.toJSON(currentArticle);
    delete article.favoritedBy;
    return {...article, isFavorited};
  }

  async toProfile(currentUser: User, isFollowed?: boolean) {
    const profile:any = await this.toJSON(currentUser);
    delete profile.followers;
    delete profile.password;
    //return isFollowed !== null ? {...profile, isFollowed} : {...profile };
    return {...profile, isFollowed};
  }

}