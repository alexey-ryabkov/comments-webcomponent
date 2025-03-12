import { User } from '../components/PostComment/types';
import { processTimestamp } from '../components/PostComment/utils';
import users from '../assets/dummy/users.json';
import PostComment from '../components/PostComment';

export const CURRENT_USER_ID = 101;
export const currentUser: User | undefined = users.filter(
  (user) => user.id === CURRENT_USER_ID,
)?.[0];

export function getCurUserCommentMeta() {
  const {
    nickname = PostComment.ANONIMUS_NICKNAME,
    avatar = PostComment.ANONIMUS_AVATAR,
  } = currentUser || {};
  return {
    userId: currentUser?.id,
    nickname,
    avatar,
    datetime: processTimestamp(Date.now()),
    current: true,
  };
}

export const genId = () => Date.now();
