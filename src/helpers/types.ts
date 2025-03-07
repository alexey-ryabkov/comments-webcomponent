import { Comment, User } from '../components/PostComment';

export type CommentMeta = Required<Omit<User, 'id'>> & {
  userId?: string | number;
  datetime:
    | {
        iso: string;
        humanized: string;
      }
    | string;
};
export type CommentData = Omit<Comment, 'user' | 'timestamp' | 'replies'> & {
  meta: CommentMeta;
};
