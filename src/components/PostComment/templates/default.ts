const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {}

  .post-comment {}

  .post-comment__wrapper {}

  .post-comment__meta {
    font-size: 0.8rem;
    color: gray;
    display: flex;
    gap: 1rem;
  }

  .post-comment__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    flex: none;
  }

  .post-comment__avatar img {
    object-fit: cover;
    width: 100%;
  }

  .post-comment__nickname :not(small) {
    font-weight: bold;
  }

  .post-comment__nickname+small {
    display: none;
  }

  .post-comment__nickname_current+small {
    display: initial;
  }

  .post-comment__content {
    width: 100%;
  }

  .post-comment__actions {
    margin-top: 0.5rem;
  }

  .post-comment__replies {
    margin-top: 1.5rem;
    margin-left: 2rem;
  }
</style>
<div class="post-comment">
  <div class="post-comment__wrapper">
    <div class="post-comment__meta">
      <div class="post-comment__avatar">
        <slot name="avatar">
          <img name="avatar" src="https://placehold.co/50" alt="Аватар пользователя не задан" />
        </slot>
      </div>
      <div>
        <div>
          <span class="post-comment__nickname">
            <slot name="nickname">
              <strong aria-label="Никнейм пользователя">Анонимный пользователь</strong>
            </slot>
          </span>
          <small>(это вы)</small>
        </div>
        <div class="post-comment__datetime">
          <slot name="datetime">
            <time slot="datetime">неизвестное время</time>
          </slot>
        </div>
      </div>
    </div>
    <div class="post-comment__content">
      <slot>
        <div aria-label="Текст комментария"></div>
      </slot>
    </div>
  </div>
  <div class="post-comment__actions">
    <button class="post-comment__like-btn" aria-label="Поставить лайк">
      ❤️ <span class="post-comment__likes">0</span>
    </button>
    <button class="post-comment__reply-btn" aria-label="Ответить на комментарий">
      Ответить
    </button>
    <button class="post-comment__delete-btn" aria-label="Удалить комментарий">
      Удалить
    </button>
  </div>
  <div class="post-comment__replies">
    <slot name="replies">
      <section aria-label="Ответы на комментарий"></section>
    </slot>
  </div>
</div>`;
export default template;
