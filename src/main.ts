import PostComment, {
  type LikeEventDetail,
  type IntentReplyEventDetail,
  type DeleteEventDetail,
} from './components/PostComment';
import { setElementDisabled } from './components/PostComment/utils';
import {
  type CommentInputEventDetail,
  COMMENT_INPUT_EVENT_NAME,
} from './helpers/event_handlers/inputComment';
import {
  type CommentPublishedEventDetail,
  COMMENT_PUBLISHED_EVENT_NAME,
} from './helpers/event_handlers/publishComment';
import {
  buildCommentAddingForm,
  deleteCommentEventHandler,
  likeCommentEventHandler,
  intentReplyEventHandler,
  scroll2elem,
} from './helpers';
import { dummyComments } from './helpers/mocks';
import '@picocss/pico';
import './global.scss';

customElements.define(PostComment.COMPONENT_NAME, PostComment);

document.addEventListener('DOMContentLoaded', () => {
  const commentsThread = document.getElementById('post-comments-tread');
  if (commentsThread) {
    // build adding thread comment form UI
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
      addCommentForm.addEventListener(COMMENT_PUBLISHED_EVENT_NAME, (e) => {
        const {
          detail: { comment },
        } = e as CustomEvent<CommentPublishedEventDetail>;
        scroll2elem(comment);
      });
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

    // build adding comments by component API UI
    document
      .getElementById('add-comment-by-api')
      ?.addEventListener('click', (e) => {
        let scrolled = false;
        dummyComments.forEach((data) => {
          const comment = new PostComment(data);
          commentsThread.append(comment);
          if (!scrolled) {
            scroll2elem(comment);
            scrolled = true;
          }
        });

        setElementDisabled(e.target as HTMLButtonElement, true);
      });
  }
});
