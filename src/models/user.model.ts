import * as mongoose from 'mongoose';
import { classToPlain } from 'class-transformer';

export const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  bio: {type: String},
  image: {type: String},
},{timestamps: true});

export interface User extends mongoose.Document {
  id: string;
  email: string;
  username: string;
  password: string;
  bio?: string;
  image?: string;
  createdAt: any;
  updatedAt: any;
}

export interface AuthPayLoad {
  username: string;
}
