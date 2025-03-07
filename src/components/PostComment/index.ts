import { Comment, User } from './types';
import { setElementHidden } from './utils';

export type LikeEventDetail = {
  likes: number;
};
export type IntentReplyEventDetail = {
  comment: PostComment;
};
export type DeleteEventDetail = {
  comment: PostComment;
};
export type { Comment, User };

export class PostComment extends HTMLElement {
  static ANONIMUS_NICKNAME = 'Анонимный пользователь';
  static ANONIMUS_AVATAR = 'https://placehold.co/50';

  static readonly COMPONENT_NAME = 'post-comment';
  static readonly LIKE_EVENT_NAME = `${PostComment.COMPONENT_NAME}-like`;
  static readonly INTENT_REPLY_EVENT_NAME = `${PostComment.COMPONENT_NAME}-intent-reply`;
  static readonly DELETE_EVENT_NAME = `${PostComment.COMPONENT_NAME}-delete`;

  protected _shadow: ShadowRoot | null = null;
  protected _tmpl!: DocumentFragment;
  protected _likes: number | null = null;

  connectedCallback() {
    if (!this._tmpl) {
      this._tmpl = PostComment.extractTemplate()!;
    }

    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.appendChild(this._tmpl);

    this._render();
  }

  static get observedAttributes() {
    return ['likes', 'deleted', 'granted', 'reply-disabled'];
  }

  attributeChangedCallback() {
    this._render();
  }

  protected _render() {
    if (!this._shadow) return;

    const { likes, replyDisabled, deleted, granted } = {
      likes: this._likes ?? this.getAttribute('likes') ?? 0,
      deleted: this.getAttribute('deleted') !== null,
      granted: this.getAttribute('granted') !== null,
      replyDisabled: this.getAttribute('reply-disabled') !== null,
    };
    this._likes ??= Number(likes);

    if (deleted) {
      this._delete();
    }

    this._getElement('likes')?.replaceChildren(
      document.createTextNode(likes.toString()),
    );

    this._getElement('like-btn')?.addEventListener('click', () => {
      const likes = ++this._likes!;
      this._getElement('likes')?.replaceChildren(
        document.createTextNode(likes.toString()),
      );
      this.dispatchEvent(
        new CustomEvent<LikeEventDetail>(PostComment.LIKE_EVENT_NAME, {
          bubbles: true,
          detail: { likes },
        }),
      );
    });
    this._getElement('reply-btn')?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent<IntentReplyEventDetail>(
          PostComment.INTENT_REPLY_EVENT_NAME,
          {
            bubbles: true,
            detail: { comment: this },
          },
        ),
      );
    });
    this._getElement('delete-btn')?.addEventListener('click', () => {
      this._delete();
      this.dispatchEvent(
        new CustomEvent<DeleteEventDetail>(PostComment.DELETE_EVENT_NAME, {
          bubbles: true,
          detail: { comment: this },
        }),
      );
    });

    this._setElementHidden('reply-btn', replyDisabled);
    this._setElementHidden('delete-btn', !granted);
  }

  protected _delete() {
    this._getElement('avatar')?.remove();
    this._getElement('nickname')?.remove();
    this._getElement('datetime')?.remove();
    this._getElement('actions')?.remove();
    this._getElement('content')?.replaceChildren(
      document.createTextNode('Комментарий удален'),
    );
  }

  protected _getElement(name: string) {
    return (this._shadow?.querySelector(
      `.${PostComment._getElemCssCls(name)}`,
    ) ?? null) as HTMLElement | null;
  }

  protected _getSlot(name: string) {
    return this._shadow?.querySelector(`slot[name="${name}"]`);
  }

  protected _setElementHidden(elemName: string, flag: boolean) {
    setElementHidden(this._getElement(elemName), flag);
  }

  protected static _getElemCssCls(elemName: string) {
    return `${PostComment.COMPONENT_NAME}__${elemName}`;
  }

  protected static _getElemModifCssCls(elemName: string, modificator: string) {
    return `${PostComment._getElemCssCls(elemName)}_${modificator}`;
  }

  public static extractTemplate() {
    const tmplElem = document.querySelector(
      'template#post-comment-template',
    ) as HTMLTemplateElement | null;

    if (!tmplElem) return;

    return tmplElem.content.cloneNode(true) as DocumentFragment;
  }
}
