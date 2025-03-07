import html from 'nanohtml';
import raw from 'nanohtml/raw';
import { CommentData } from '../types';

export default function buildComment(
  {
    meta: { nickname, avatar, datetime },
    text,
    likes,
    granted,
    deleted,
  }: CommentData,
  container: HTMLElement,
) {
  const { humanized: humanDatetime, iso: isoDatetime } =
    typeof datetime == 'string' ? { humanized: datetime } : datetime;

  const comment = html` <article aria-label="Комментарий">
    <post-comment
      ${likes ? { likes } : {}}
      ${granted ? { granted: '' } : {}}
      ${deleted ? { deleted: '' } : {}}
    >
      <time slot="datetime" ${isoDatetime ? { datetime: isoDatetime } : {}}>
        ${humanDatetime}
      </time>
      <div slot="nickname">
        <strong aria-label="Никнейм пользователя">${nickname}</strong>
        <small>(это вы)</small>
      </div>
      <img
        slot="avatar"
        src="${avatar}"
        alt="Аватар пользователя ${nickname}"
      />
      <div aria-label="Текст комментария">${raw(text)}</div>
    </post-comment>
  </article>`;
  container.appendChild(comment);

  return comment;
}
