export type CommentInputEventDetail = {
  filled: boolean;
};

export const COMMENT_INPUT_EVENT_NAME = 'comment-input';

export default function inputCommentEventHandler(
  inputCommentEvent: InputEvent,
) {
  const inputCommentElement = inputCommentEvent.target as HTMLInputElement;
  const addCommentForm = inputCommentElement.closest(
    'form',
  ) as HTMLFormElement | null;
  if (addCommentForm) {
    const commentButton = addCommentForm.querySelector(
      'button:not([type="reset"])',
    ) as HTMLButtonElement | null;

    if (inputCommentElement && commentButton) {
      const comment = inputCommentElement.value.trim();
      const minLength = Number(
        inputCommentElement.getAttribute('minlength') ?? 0,
      );
      const maxLength = Number(
        inputCommentElement.getAttribute('maxlength') ?? Infinity,
      );
      addCommentForm.dispatchEvent(
        new CustomEvent<CommentInputEventDetail>(COMMENT_INPUT_EVENT_NAME, {
          detail: { filled: comment.length > 0 },
        }),
      );
      commentButton.disabled =
        comment.length < minLength || comment.length > maxLength;
    }
  }
}
