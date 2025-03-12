import html from 'nanohtml';
import raw from 'nanohtml/raw';
import { CommentData } from '../types';

export default function buildComment(
  {
    meta: { nickname, avatar, datetime, current },
    text,
    likes,
    granted,
    deleted,
  }: CommentData,
  container: HTMLElement,
) {
  const { humanized: humanDatetime, iso: isoDatetime } =
    typeof datetime == 'string' ? { humanized: datetime } : datetime;

  const comment = html` <post-comment
    ${likes ? { likes } : {}}
    ${granted ? { granted: '' } : {}}
    ${deleted ? { deleted: '' } : {}}
    ${current ? { 'by-current-user': '' } : {}}
  >
    <time slot="datetime" ${isoDatetime ? { datetime: isoDatetime } : {}}>
      ${humanDatetime}
    </time>
    <strong slot="nickname" aria-label="Никнейм пользователя"
      >${nickname}</strong
    >
    <img slot="avatar" src="${avatar}" alt="Аватар пользователя ${nickname}" />
    <div aria-label="Текст комментария">${raw(text)}</div>
  </post-comment>`;
  container.appendChild(comment);

  return comment;
}
