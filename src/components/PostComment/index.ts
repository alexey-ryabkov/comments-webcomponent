import { Comment, User, SlotName, PartialBy } from './types';
import * as utils from './utils';
import { defaultTemplate } from './templates';

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

class PostComment extends HTMLElement {
  static readonly COMPONENT_NAME = 'post-comment';
  static readonly LIKE_EVENT_NAME = `${PostComment.COMPONENT_NAME}-like`;
  static readonly INTENT_REPLY_EVENT_NAME = `${PostComment.COMPONENT_NAME}-intent-reply`;
  static readonly DELETE_EVENT_NAME = `${PostComment.COMPONENT_NAME}-delete`;

  static EXT_TEMPLATE_ID = `${PostComment.COMPONENT_NAME}-template`;
  static ANONIMUS_NICKNAME = 'Анонимный пользователь';
  static ANONIMUS_AVATAR = 'https://placehold.co/50';

  protected static _sanitizer = new utils.HTMLSanitizer();

  protected _shadow: ShadowRoot | null = null;
  protected _liked = false;
  protected _deleted = false;

  protected _slotElemsWrappers = utils._buildSlotElemsWrappers();

  constructor(
    protected _initData?: PartialBy<Comment, 'timestamp'>,
    public template = PostComment._obtainTemplate(),
    protected _wrapper: HTMLElement | null = utils.defaultCommentWrapper(),
  ) {
    super();
    if (this._initData) {
      this.template ??= defaultTemplate;

      this._prepareSlotElemsWrappers();

      const {
        id,
        user: {
          id: userId,
          nickname = PostComment.ANONIMUS_NICKNAME,
          avatar = PostComment.ANONIMUS_AVATAR,
          current = false,
        },
        timestamp = Date.now(),
        text,
        likes = 0,
        replies = [],
        granted = false,
        deleted = false,
      } = this._initData;

      if (!deleted) {
        this._buildNicknameElement(nickname);
        this._buildAvatarElement(avatar);
        this._buildDatetimeElement(timestamp);
        this._buildCommentTextElement(text);

        this.likes = likes;
        this.replies = replies.map(
          (reply) => new PostComment(reply, this.template, this._wrapper),
        );

        utils.setFlagAttrVal(this, 'granted', granted);
        utils.setFlagAttrVal(this, 'by-current-user', current);

        this.dataset.id = id.toString();
        this.dataset.userId = userId.toString();
      } else {
        this.delete();
      }
    }
  }

  static get observedAttributes() {
    return ['likes', 'deleted'];
  }

  static get allowedTextTags() {
    return Array.from(PostComment._sanitizer.allowedTags);
  }

  static set allowedTextTags(allowedTags: string[]) {
    PostComment._sanitizer.allowedTags = new Set(allowedTags);
  }

  get likes() {
    return Number(this.getAttribute('likes') ?? 0);
  }

  set likes(count: number) {
    this.setAttribute('likes', (count > 0 ? count : 0).toString());
  }

  get replies() {
    const slotElements = this._getSlotElements(SlotName.replies);
    return [
      ...(slotElements?.filter((elem) => elem instanceof PostComment) ?? []),
      ...((slotElements
        ?.filter((elem) => !(elem instanceof PostComment))
        ?.flatMap((elem) =>
          Array.from(elem.querySelectorAll(PostComment.COMPONENT_NAME) ?? []),
        ) ?? []) as PostComment[]),
    ];
  }

  set replies(comments: PostComment[]) {
    if (!comments.length) {
      this._deleteSlotElements(SlotName.replies);
      return;
    }
    const tmp = document.createElement('template');
    tmp.content.append(...comments);
    this._wrapElemAndInsert2slot(tmp.content, SlotName.replies);
  }

  get deleted() {
    return this._deleted;
  }

  get initData() {
    return this._initData;
  }

  connectedCallback() {
    this.template ??= defaultTemplate;

    if (this._wrapper && this.parentNode && this.parentNode !== this._wrapper) {
      this.parentNode.insertBefore(this._wrapper, this);
      this._wrapper.appendChild(this);
    }

    if (!this._shadow) {
      this._shadow = this.attachShadow({ mode: 'open' });
      this._shadow.appendChild(this.template.content.cloneNode(true));
      this._attachEventListeners();
    }

    this._render();
  }

  attributeChangedCallback() {
    if (this._deleted) return;
    this._render();
  }

  addReply(comment: PostComment) {
    if (!this.replies.length) {
      this.replies = [comment];
    } else {
      if (this._slotElemsWrappers[SlotName.replies]) {
        this._slotElemsWrappers[SlotName.replies].appendChild(comment);
      } else {
        utils.insertElem2slot(this, comment, SlotName.replies);
      }
    }
  }

  delete() {
    utils.setFlagAttrVal(this, 'deleted', true);
  }

  protected _render() {
    if (!this._shadow) return;

    if (utils.getFlagAttrVal(this, 'deleted')) {
      this._delete();
      return;
    }

    utils.setElementHidden(
      this._getElement('delete-btn'),
      !utils.getFlagAttrVal(this, 'granted'),
    );

    this._getElement('likes')?.replaceChildren(
      document.createTextNode(this.getAttribute('likes') ?? '0'),
    );

    const likeBtn = this._getElement('like-btn') as HTMLButtonElement | null;

    this._getElement('nickname')?.classList.toggle(
      PostComment._getElemModifCssCls('nickname', 'current'),
      utils.getFlagAttrVal(this, 'by-current-user'),
    );

    const byCurrentUser = utils.getFlagAttrVal(this, 'by-current-user');
    if (byCurrentUser) {
      utils.setElementDisabled(likeBtn, true);
    }
  }

  protected _attachEventListeners() {
    const likeBtn = this._getElement('like-btn') as HTMLButtonElement | null;
    likeBtn?.addEventListener('click', () => {
      if (!this._liked) {
        const likes = Number(this.getAttribute('likes') ?? 0) + 1;
        this.setAttribute('likes', String(likes));
        this._getElement('likes')?.replaceChildren(
          document.createTextNode(String(likes)),
        );
        this.dispatchEvent(
          new CustomEvent<LikeEventDetail>(PostComment.LIKE_EVENT_NAME, {
            bubbles: true,
            composed: true,
            detail: { likes },
          }),
        );
        utils.setElementDisabled(likeBtn, true);
      }
    });

    this._getElement('reply-btn')?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent<IntentReplyEventDetail>(
          PostComment.INTENT_REPLY_EVENT_NAME,
          {
            bubbles: true,
            composed: true,
            detail: { comment: this },
          },
        ),
      );
    });

    this._getElement('delete-btn')?.addEventListener('click', () => {
      this.delete();
      this.dispatchEvent(
        new CustomEvent<DeleteEventDetail>(PostComment.DELETE_EVENT_NAME, {
          bubbles: true,
          composed: true,
          detail: { comment: this },
        }),
      );
    });
  }

  protected _delete() {
    Object.entries(SlotName).forEach(([_, name]) => {
      const slot = this._getSlot(name);
      if (name === SlotName.default) {
        slot?.replaceWith('Комментарий удален');
        this._deleteSlotElements(name);
      } else if (name !== SlotName.replies) {
        slot?.remove();
        this._deleteSlotElements(name);
      }
    });

    this._getElement('meta')?.remove();
    this._getElement('actions')?.remove();

    Array.from(this.attributes).forEach(({ name }) => {
      if (name !== 'deleted') {
        this.removeAttribute(name);
      }
    });
    this._deleted = true;
  }

  protected static _obtainTemplate() {
    return document.querySelector(
      `template#${PostComment.EXT_TEMPLATE_ID}`,
    ) as HTMLTemplateElement | null;
  }

  protected _buildNicknameElement(value: string) {
    this._wrapElemAndInsert2slot(value, SlotName.nickname);
  }

  protected _buildAvatarElement(src: string) {
    let avatar: HTMLImageElement;
    const wrapper = this._getSlotElemWrapper(SlotName.avatar);
    if (wrapper instanceof HTMLImageElement) {
      avatar = wrapper;
    } else {
      avatar = document.createElement('img');
      if (wrapper) {
        wrapper.replaceChildren(avatar);
      }
    }
    avatar.src = src;
  }

  protected _buildDatetimeElement(timestamp: number) {
    const { iso, humanized } = utils.processTimestamp(timestamp);
    const elem = this._wrapElemAndInsert2slot(humanized, SlotName.datetime);
    if (elem instanceof HTMLTimeElement) {
      elem.setAttribute('datetime', iso);
    }
  }

  protected _buildCommentTextElement(text: string) {
    const tmp = document.createElement('template');
    tmp.innerHTML = PostComment._sanitizer.clean(text);
    this._wrapElemAndInsert2slot(tmp.content);
  }

  protected _wrapElemAndInsert2slot(
    elem: Node | string,
    name = SlotName.default,
  ) {
    const wrapped = this._wrapSlotElement(elem, name);
    return utils.insertElem2slot(this, wrapped, name);
  }

  protected _wrapSlotElement(elem: Node | string, name = SlotName.default) {
    let wrapper = this._getSlotElemWrapper(name);
    if (wrapper) {
      wrapper.replaceChildren(elem);
    } else if (
      elem instanceof HTMLElement ||
      elem instanceof DocumentFragment
    ) {
      return elem;
    } else {
      // if (typeof elem === 'string') {
      //   elem = document.createTextNode(elem);
      // }
      wrapper = document.createElement('div');
      wrapper.append(elem);
      this._slotElemsWrappers[name] = wrapper;
    }
    return wrapper as Node;
  }

  protected _getSlotElemWrapper(name: SlotName) {
    // return (this._wrappers[name]?.cloneNode() ?? null) as HTMLElement | null;
    return this._slotElemsWrappers[name];
  }

  protected _prepareSlotElemsWrappers() {
    if (!this.template) return;
    let name: SlotName;
    for (name in this._slotElemsWrappers) {
      const slot = this._getSlotTemplate(name);
      if (slot) {
        this._slotElemsWrappers[name] = slot.children
          .item(0)
          ?.cloneNode(false) as HTMLElement | null;
      }
    }
  }

  protected _getSlot(name?: SlotName) {
    return this._shadow ? utils.querySlot(this._shadow, name) : null;
  }

  protected _getSlotElements(name?: SlotName, flatten = false) {
    return this._getSlot(name)?.assignedElements({ flatten }) ?? null;
  }

  protected _deleteSlotElements(name?: SlotName) {
    return this._getSlotElements(name)?.forEach((elem) => elem.remove());
  }

  protected _getSlotTemplate(name?: SlotName) {
    return this.template ? utils.querySlot(this.template.content, name) : null;
  }

  protected _getElement(name: string) {
    return (this._shadow?.querySelector(
      `.${PostComment._getElemCssCls(name)}`,
    ) ?? null) as HTMLElement | null;
  }

  protected static _getElemCssCls(elemName: string) {
    return `${PostComment.COMPONENT_NAME}__${elemName}`;
  }

  protected static _getElemModifCssCls(elemName: string, modificator: string) {
    return `${PostComment._getElemCssCls(elemName)}_${modificator}`;
  }
}
export default PostComment;
// FIXME
// @ts-expect-error FIXME for debug
window.PostComment = PostComment;
