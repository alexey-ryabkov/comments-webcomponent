import PostComment, {
  type LikeEventDetail,
  type IntentReplyEventDetail,
  type DeleteEventDetail,
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
import { genId } from './helpers/mocks';
import '@picocss/pico';

customElements.define(PostComment.COMPONENT_NAME, PostComment);

document.addEventListener('DOMContentLoaded', () => {
  const commentsThread = document.getElementById('post-comments-tread');
  if (commentsThread) {
    // build add thread comment form UI
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

    // build add comments by component API UI
    document
      .getElementById('add-comment-by-api')
      ?.addEventListener('click', (e) => {
        const button = e.target as HTMLButtonElement;

        // TODO генерить из dummy
        const apiComment = new PostComment({
          id: genId(),
          user: {
            id: genId(),
            nickname: 'API пользователь',
            current: false,
          },
          text: '<b>API</b> <i>комментарий</i>',
          likes: 100,
          granted: true,
          deleted: false,
        });
        commentsThread.append(apiComment);

        apiComment.replies = [
          new PostComment({
            id: genId(),
            user: {
              id: genId(),
              nickname: 'API пользователь 2!',
              current: true,
            },
            text: '<b>API</b> <i>комментарий</i> <b>2</b>',
          }),
          new PostComment({
            id: genId(),
            user: {
              id: genId(),
              nickname: 'API пользователь 3!',
              current: false,
            },
            text: '<b>API</b> <i>комментарий</i> <b>3</b>',
            granted: true,
          }),
        ];
        apiComment.addReply(
          new PostComment({
            id: genId(),
            user: {
              id: genId(),
              nickname: 'API пользователь 4!',
              current: false,
            },
            likes: 33,
            text: '<b>API</b> <i>комментарий</i> <b>4</b>',
          }),
        );

        // FIXME
        // @ts-expect-error for debug
        window.apiComment = apiComment;

        button.disabled = true;
      });
  }
});
