import { CommentMeta } from './types';
import { Comment, User } from '../components/PostComment/types';
import { processTimestamp } from '../components/PostComment/utils';
import PostComment from '../components/PostComment';
import users from '../assets/dummy/users.json';
import comments from '../assets/dummy/comments.json';

type DummyUser = User;
type DummyComment = Omit<Comment, 'user' | 'replies'> & {
  user: User['id'];
  replies: DummyComment[];
};

const DUMMY_AVATAR_BASE_URL = 'https://api.dicebear.com/9.x';
const DUMMY_AVATAR_STYLE = 'avataaars';
const DUMMY_AVATAR_FORMAT = 'png';
const DUMMY_AVATAR_BG_COLOR = '0172ad';

let curDummuUserId: DummyUser['id'];
const dummyUsers: DummyUser[] = (users as User[]).map(
  ({ id, nickname, avatar, current }) => ({
    id,
    nickname,
    avatar: avatar ?? getDummyAvatarSrc(nickname),
    current: Boolean(current && !curDummuUserId && (curDummuUserId = id)),
  }),
);
const curDummyUser: DummyUser | undefined = dummyUsers.filter(
  ({ current }) => current,
)?.[0];

export const dummyComments: Comment[] = getDummyComments(
  comments as DummyComment[],
);

function getDummyComments(dummyComments: DummyComment[]): Comment[] {
  return dummyComments.map(
    ({ id, user, timestamp, text, likes, replies, granted, deleted }) => ({
      id,
      user:
        dummyUsers.find(({ id }) => id.toString() === user.toString()) ??
        genAnonimus(),
      timestamp,
      text,
      likes,
      replies: replies ? getDummyComments(replies) : undefined,
      granted: granted || curDummyUser?.id.toString() === String(user),
      deleted,
    }),
  );
}

export function getDummyAvatarSrc(
  nickname: string,
  size = PostComment.avatarSize,
) {
  const url = new URL(
    `${DUMMY_AVATAR_BASE_URL}/${DUMMY_AVATAR_STYLE}/${DUMMY_AVATAR_FORMAT}`,
  );
  const params = new URLSearchParams({
    seed: nickname,
    backgroundColor: DUMMY_AVATAR_BG_COLOR,
    size: size.toString(),
  });
  url.search = params.toString();
  return url.toString();
}

export function getCurDummyUserCommentMeta(): CommentMeta {
  const {
    nickname = PostComment.anonimusNickname,
    avatar = PostComment.anonimusAvatar,
  } = curDummyUser || genAnonimus();
  return {
    userId: curDummyUser?.id,
    nickname,
    avatar,
    datetime: processTimestamp(Date.now()),
    current: true,
  };
}

export function genAnonimus() {
  return {
    id: genId(),
    nickname: PostComment.anonimusNickname,
    avatar: PostComment.anonimusAvatar,
    current: false,
  };
}

export function genId() {
  return Date.now();
}
