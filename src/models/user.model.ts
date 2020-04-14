import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  bio: {type: String},
  image: {type: String},
  followers: { type: Array,  items: { type: String, trim: true}, },
  articles: {type: [String], trim: true},
  favorites: {type: [String], trim: true},
},{timestamps: true});

export interface User extends mongoose.Document {
  id: string;
  email: string;
  username: string;
  password: string;
  bio?: string;
  image?: string;
  followers?: [string]; //user id
  articles?: [string]; //article ids written by this user
  favorites?: [string]; //article ids of favoritedBy added.
  createdAt: any;
  updatedAt: any;
}

export class AuthPayLoad {
  username: string;
}
