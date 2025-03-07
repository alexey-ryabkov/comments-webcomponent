export type User = {
  id: string | number;
  nickname: string;
  avatar?: string;
};

export type Comment = {
  id: string | number;
  user: User;
  timestamp: number;
  text: string;
  likes?: number;
  replies?: Comment[];
  granted?: boolean;
  deleted?: boolean;
};
