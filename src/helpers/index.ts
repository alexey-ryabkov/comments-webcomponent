import { LikeEventDetail } from '../components/PostComment';

import buildCommentAddingForm from './builders/commentAddingForm';
import intentReplyEventHandler from './event_handlers/intentReply';
import deleteCommentEventHandler from './event_handlers/deleteComment';

export {
  buildCommentAddingForm,
  intentReplyEventHandler,
  deleteCommentEventHandler,
};

export const likeCommentEventHandler = (e: CustomEvent<LikeEventDetail>) =>
  // eslint-disable-next-line no-console
  console.log('comment likes count', e.detail.likes);

export const scroll2elem = (elem: HTMLElement) =>
  elem.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
