import DOMPurify from 'dompurify';
import buildComment from '../builders/comment';
import getCurUserCommentMeta from '../userCommentMeta';

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

    const meta = getCurUserCommentMeta();
    buildComment(
      {
        id: Date.now(),
        meta,
        text: DOMPurify.sanitize(commentText, {
          ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'br', 'img'],
          ALLOWED_ATTR: ['src', 'alt'],
          FORBID_ATTR: ['onerror', 'onload'],
        }),
        granted: meta.userId !== undefined,
      },
      commentsContainer,
    );
  }
}
