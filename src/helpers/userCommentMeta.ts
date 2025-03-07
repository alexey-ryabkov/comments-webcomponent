import { User } from '../components/PostComment/types';
import { prettyDateTime } from '../components/PostComment/utils';
import users from '../assets/dummy/users.json';
import { PostComment } from '../components/PostComment';

export const CURRENT_USER_ID = 101;
export const currentUser: User | undefined = users.filter(
  (user) => user.id === CURRENT_USER_ID,
)?.[0];

export default function getCurUserCommentMeta() {
  const {
    nickname = PostComment.ANONIMUS_NICKNAME,
    avatar = PostComment.ANONIMUS_AVATAR,
  } = currentUser || {};
  const datetime = new Date();
  return {
    userId: currentUser?.id,
    nickname,
    avatar,
    datetime: {
      iso: datetime.toISOString(),
      humanized: prettyDateTime(datetime),
    },
  };
}
