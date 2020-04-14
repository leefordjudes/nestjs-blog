import * as mongoose from 'mongoose';

import { classToPlain } from 'class-transformer';

export const articleSchema = new mongoose.Schema({
  slug: {type: String},
  title: {type: String, required: true},
  description: {type: String, required: true},
  body: {type: String, required: true},
  tagList: {type: Array, items: { type: String }, required: true },
  favoritedBy: {type: Array, items: { type: String } },
  favoritesCount: {type: Number},
  author: {
    id: {type: String, trim:true},
    username: {type: String, trim:true},
    bio: {type: String},
    image: {type: String},
    isFollowed: {type: Boolean},
  },
},{timestamps: true});

export interface Article extends mongoose.Document {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  favoritedBy: string[]; //user ids
  favoritesCount: number; // length of favoritedBy array
  author: {
    id: string;
    username: string;
    bio?: string;
    image?: string;
    isFollowed?: boolean;
  };
  createdAt: any;
  updatedAt: any;

  // async toJSON() {
  //   return classToPlain(this);
  // }

}
