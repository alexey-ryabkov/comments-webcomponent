import { DeleteEventDetail } from '../../components/PostComment';

export default function deleteCommentEventHandler({
  detail,
}: CustomEvent<DeleteEventDetail>) {
  const { comment } = detail;
  // eslint-disable-next-line no-console
  console.log('deleted comment', comment);

  const addCommentForm = comment.querySelector(
    ':scope > [slot="replies"] > form',
  ) as HTMLFormElement | null;
  addCommentForm?.remove();
}
