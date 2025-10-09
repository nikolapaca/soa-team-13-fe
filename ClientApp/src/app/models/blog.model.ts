import { Comment } from "./comment.model";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  likes?: string[];
  comments: Comment[];
}