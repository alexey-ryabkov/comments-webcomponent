import html from 'nanohtml';
import raw from 'nanohtml/raw';
import publishCommentEventHandler from '../event_handlers/publishComment';
import inputCommentEventHandler from '../event_handlers/inputComment';
import { setElementDisabled } from '../../components/PostComment/utils';

export default function buildCommentAddingForm(
  form?: HTMLFormElement | null,
  commentsContainer = document.body,
  formContainer?: HTMLElement | null,
) {
  if (!form) {
    form = html` <form>
      <textarea
        placeholder="Написать комментарий..."
        required
        minlength="1"
        maxlength="1024"
      ></textarea>
      <button disabled>Отправить</button>
      ${raw(' ')}
      <button type="reset">Отменить</button>
    </form>` as HTMLFormElement;

    (formContainer ?? commentsContainer).prepend(form);
  }

  if (!form._addCommentOnSubmit) {
    form._addCommentOnSubmit = (e: SubmitEvent) =>
      publishCommentEventHandler(e, commentsContainer);
  }

  if (!form._onReset) {
    const button = form.querySelector(
      'button:not([type="reset"])',
    ) as HTMLButtonElement | null;
    form._onReset = () => setElementDisabled(button, true);
  }

  form.addEventListener('submit', form._addCommentOnSubmit);
  form.addEventListener('reset', form._onReset);
  form
    .querySelector('textarea')
    ?.addEventListener('input', inputCommentEventHandler as EventListener);

  return form;
}
