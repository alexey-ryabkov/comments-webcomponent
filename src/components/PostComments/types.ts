export type User = {
  id: string;
  nickname: string;
  avatar?: string;
};

export type Comment = {
  id: string;
  user: User;
  timestamp: number;
  text: string;
  likes: number;
  replies?: Comment;
};
