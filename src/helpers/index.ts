import {
  LikeEventDetail,
  // ReplyEventDetail,
} from '../components/PostComment';

import buildCommentAddingForm from './builders/commentAddingForm';
import intentReplyEventHandler from './event_handlers/intentReply';
// import likeCommentEventHandler from './event_handlers/addComment';
import deleteCommentEventHandler from './event_handlers/deleteComment';

export {
  buildCommentAddingForm,
  // likeCommentEventHandler,
  intentReplyEventHandler,
  deleteCommentEventHandler,
};

export const likeCommentEventHandler = (e: CustomEvent<LikeEventDetail>) =>
  // eslint-disable-next-line no-console
  console.log('comment likes count', e.detail.likes);
