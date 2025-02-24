import '@picocss/pico';
import { PostCommentsComponent } from './components/PostComments';

console.log('Hello, Web-components!');

customElements.define('post-comments', PostCommentsComponent);
