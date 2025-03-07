import html from 'nanohtml';
import { IntentReplyEventDetail } from '../../components/PostComment';
import buildCommentAddingForm from '../builders/commentAddingForm';

export default function intentReplyEventHandler({
  detail,
}: CustomEvent<IntentReplyEventDetail>) {
  const { comment } = detail;
  // eslint-disable-next-line no-console
  console.log('intent to reply on comment', comment);

  let commentReplyes = comment.querySelector('[slot="replies"]') as HTMLElement;
  if (!commentReplyes) {
    commentReplyes = html`<section
      slot="replies"
      aria-label="Ответы на комментарий"
    />` as HTMLElement;
    comment.appendChild(commentReplyes);
  }

  let addCommentForm = comment.querySelector('form') as HTMLFormElement | null;
  addCommentForm = buildCommentAddingForm(addCommentForm, commentReplyes);

  addCommentForm.hidden = false;
  if (!addCommentForm._resetFormHandler) {
    addCommentForm._hideForm = () => (addCommentForm.hidden = true);
  }
  addCommentForm.addEventListener('reset', addCommentForm._hideForm);
  addCommentForm.addEventListener('submit', addCommentForm._hideForm);
}
