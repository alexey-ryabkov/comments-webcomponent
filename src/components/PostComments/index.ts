import { html } from 'htm/preact';
import { uniqueId, now } from 'lodash';
import { Comment } from './types';

export class PostCommentsComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private data: Comment;
  private granted: string | undefined;

  constructor(data: Comment, granted?: string) {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.data = data;
    this.granted = granted;
    this.render();
  }

  connectedCallback() {
    this.attachEventListeners();
  }

  private attachEventListeners() {
    this.shadow
      .querySelector('.like-btn')
      ?.addEventListener('click', () => this.handleLike());
    this.shadow
      .querySelector('.reply-btn')
      ?.addEventListener('click', () => this.handleReply());
    this.shadow
      .querySelector('.delete-btn')
      ?.addEventListener('click', () => this.handleDelete());
    this.shadow.querySelector('.reply-btn')?.addEventListener('click', () => {
      const replyContainer = this.shadow.querySelector('.replies');
      if (replyContainer && !replyContainer.querySelector('form')) {
        replyContainer.appendChild(
          this.createCommentForm((text) => {
            const newReply: Comment = {
              id: uniqueId('comment_'),
              user: {
                id: 'current_user',
                avatar: 'https://placehold.co/50',
                nickname: 'Вы',
              },
              timestamp: now(),
              text,
              likes: 0,
              replies: [],
            };
            this.data.replies?.push(newReply);
            this.update();
          }),
        );
      }
    });
  }

  private handleLike() {
    this.data.likes++;
    this.update();
  }

  private handleReply() {
    const reply = prompt('Введите ваш ответ:');
    if (reply) {
      const newReply: Comment = {
        id: uniqueId('comment_'),
        user: {
          id: 'current_user',
          avatar: 'https://placehold.co/50',
          nickname: 'Вы',
        },
        timestamp: now(),
        text: reply,
        likes: 0,
        replies: [],
      };
      this.data.replies = this.data.replies || [];
      this.data.replies.push(newReply);
      this.update();
    }
  }

  private handleDelete() {
    if (
      this.granted === 'admin' ||
      (this.granted && this.granted === this.data.user.id)
    ) {
      this.data.deleted = true;
      this.update();
    }
  }

  private createCommentForm(onSubmit: (text: string) => void) {
    const form = document.createElement('form');
    form.innerHTML = `
    <input type="text" class="comment-input" placeholder="Введите комментарий" required>
    <button type="submit">Отправить</button>
  `;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('.comment-input') as HTMLInputElement;
      if (input.value.trim()) {
        onSubmit(input.value.trim());
        input.value = '';
      }
    });
    return form;
  }

  private render() {
    const { user, timestamp, text, likes, replies, deleted } = this.data;
    if (deleted) {
      this.shadow.innerHTML = '<p>Комментарий удален</p>';
      return;
    }

    this.shadow.innerHTML = html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid var(--border-color, #ccc);
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .comment {
          display: flex;
          gap: 1rem;
        }
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-image: url(${user.avatar || 'https://placehold.co/50'});
          background-size: cover;
        }
        .content {
          flex: 1;
        }
        .meta {
          font-size: 0.8rem;
          color: gray;
        }
        .actions {
          margin-top: 0.5rem;
        }
        .replies {
          margin-left: 2rem;
        }
      </style>
      <div class="comment">
        <div class="avatar"></div>
        <div class="content">
          <div class="meta">
            <strong>${user.nickname}</strong> —
            ${new Date(timestamp).toLocaleString()}
          </div>
          <div class="text">${text}</div>
          <div class="actions">
            <button class="like-btn">❤️ ${likes}</button>
            <button class="reply-btn">Ответить</button>
            ${this.granted === 'admin' || this.granted === user.id
              ? '<button class="delete-btn">Удалить</button>'
              : ''}
          </div>
          <div class="replies">
            ${(replies || [])
              .map(
                (reply) =>
                  new PostCommentsComponent(reply, this.granted).outerHTML,
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    const commentFormContainer = document.createElement('div');
    commentFormContainer.appendChild(
      this.createCommentForm((text) => {
        const newComment: Comment = {
          id: uniqueId('comment_'),
          user: {
            id: 'current_user',
            avatar: 'https://placehold.co/50',
            nickname: 'Вы',
          },
          timestamp: now(),
          text,
          likes: 0,
          replies: [],
        };
        this.data.replies = this.data.replies || [];
        this.data.replies.push(newComment);
        this.update();
      }),
    );

    this.shadow.appendChild(commentFormContainer);
  }

  private update() {
    this.render();
    this.attachEventListeners();
  }
}
