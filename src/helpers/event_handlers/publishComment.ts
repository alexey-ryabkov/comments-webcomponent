import DOMPurify from 'dompurify';
import PostComment from '../../components/PostComment';
import buildComment from '../builders/comment';
import { getCurDummyUserCommentMeta } from '../mocks';

export type CommentPublishedEventDetail = {
  comment: PostComment;
};

export const COMMENT_PUBLISHED_EVENT_NAME = 'comment-published';

export default function publishCommentEventHandler(
  publishCommentEvent: SubmitEvent,
  commentsContainer: HTMLElement,
) {
  publishCommentEvent.preventDefault();

  const addCommentForm = publishCommentEvent.target as HTMLFormElement;
  const commentInput = addCommentForm?.querySelector('textarea');
  if (commentInput) {
    const commentText = commentInput.value.trim();
    commentInput.value = '';
    commentInput.dispatchEvent(new Event('input'));

    const meta = getCurDummyUserCommentMeta();
    const comment = buildComment(
      {
        id: Date.now(),
        meta,
        text: DOMPurify.sanitize(commentText, {
          ALLOWED_TAGS: [
            'b',
            'i',
            'u',
            's',
            'small',
            'mark',
            'blockquote',
            'img',
          ],
          ALLOWED_ATTR: ['src', 'alt'],
          FORBID_ATTR: ['onerror', 'onload'],
        }),
        granted: meta.userId !== undefined,
      },
      commentsContainer,
    );
    addCommentForm.dispatchEvent(
      new CustomEvent<CommentPublishedEventDetail>(
        COMMENT_PUBLISHED_EVENT_NAME,
        {
          bubbles: true,
          composed: true,
          detail: { comment },
        },
      ),
    );
  }
}
