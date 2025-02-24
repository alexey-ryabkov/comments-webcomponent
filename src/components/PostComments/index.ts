import { html } from 'htm/preact';
import { uniqueId } from 'lodash';

interface CommentData {
  id: string;
  user: {
    avatar: string;
    nickname: string;
  };
  timestamp: string;
  text: string;
  likes: number;
  replies?: CommentData[];
}

export class PostCommentsComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private data: CommentData;

  constructor(data: CommentData) {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.data = data;
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
  }

  private handleLike() {
    this.data.likes++;
    this.update();
  }

  private handleReply() {
    const reply = prompt('Введите ваш ответ:');
    if (reply) {
      const newReply: CommentData = {
        id: uniqueId('comment_'),
        user: {
          avatar: 'https://placehold.co/50',
          nickname: 'Вы',
        },
        timestamp: new Date().toLocaleString(),
        text: reply,
        likes: 0,
      };
      this.data.replies = this.data.replies || [];
      this.data.replies.push(newReply);
      this.update();
    }
  }

  private render() {
    const { user, timestamp, text, likes, replies } = this.data;
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
          background-image: url(${user.avatar});
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
            <strong>${user.nickname}</strong> — ${timestamp}
          </div>
          <div class="text">${text}</div>
          <div class="actions">
            <button class="like-btn">❤️ ${likes}</button>
            <button class="reply-btn">Ответить</button>
          </div>
          <div class="replies">
            ${(replies || [])
              .map((reply) => new PostCommentsComponent(reply).outerHTML)
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  private update() {
    this.render();
    this.attachEventListeners();
  }
}
