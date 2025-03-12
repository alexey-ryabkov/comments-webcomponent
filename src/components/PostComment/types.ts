export type User = {
  id: string | number;
  nickname: string;
  avatar?: string;
  current?: boolean;
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

export type DateFormated = {
  iso: 'string';
  humanized: 'string';
};

export enum SlotName {
  nickname = 'nickname',
  datetime = 'datetime',
  avatar = 'avatar',
  replies = 'replies',
  default = 'default',
}

export type SlotWrappers = { [key in SlotName]: HTMLElement | null };

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
