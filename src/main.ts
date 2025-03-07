import {
  type LikeEventDetail,
  type IntentReplyEventDetail,
  type DeleteEventDetail,
  PostComment,
} from './components/PostComment';
import {
  buildCommentAddingForm,
  deleteCommentEventHandler,
  likeCommentEventHandler,
  intentReplyEventHandler,
} from './helpers';
import {
  type CommentInputEventDetail,
  COMMENT_INPUT_EVENT_NAME,
} from './helpers/event_handlers/inputComment';
import '@picocss/pico';

customElements.define(PostComment.COMPONENT_NAME, PostComment);

document.addEventListener('DOMContentLoaded', () => {
  const commentsThread = document.getElementById('post-comments-tread');
  if (commentsThread) {
    const addCommentForm = buildCommentAddingForm(
      document.getElementById('add-comment-form') as HTMLFormElement,
      commentsThread,
    );

    const resetButton = addCommentForm?.querySelector(
      'button[type="reset"]',
    ) as HTMLElement | null;
    if (resetButton) {
      resetButton.hidden = true;
      addCommentForm.addEventListener(COMMENT_INPUT_EVENT_NAME, (e) => {
        const {
          detail: { filled },
        } = e as CustomEvent<CommentInputEventDetail>;
        resetButton.hidden = !filled;
      });
      addCommentForm.addEventListener(
        'reset',
        () => (resetButton.hidden = true),
      );
    }

    commentsThread.addEventListener(PostComment.LIKE_EVENT_NAME, (e) =>
      likeCommentEventHandler(e as CustomEvent<LikeEventDetail>),
    );
    commentsThread.addEventListener(PostComment.INTENT_REPLY_EVENT_NAME, (e) =>
      intentReplyEventHandler(e as CustomEvent<IntentReplyEventDetail>),
    );
    commentsThread.addEventListener(PostComment.DELETE_EVENT_NAME, (e) =>
      deleteCommentEventHandler(e as CustomEvent<DeleteEventDetail>),
    );
  }
});
