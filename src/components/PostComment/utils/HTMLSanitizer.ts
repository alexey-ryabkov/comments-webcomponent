export default class HTMLSanitizer {
  public allowedTags: Set<string>;

  constructor(allowedTags: string[] = ['b', 'i', 'u', 'strong', 'em']) {
    this.allowedTags = new Set(allowedTags);
  }

  clean(input: string): string {
    if (!/<[a-z][\s\S]*>/i.test(input)) {
      return input;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html');

    if (!doc.body) {
      return input;
    }

    const wrapped = doc.body.firstElementChild as HTMLElement;
    if (!wrapped) {
      return input;
    }

    this._clean(wrapped, ['div']);

    return wrapped.innerHTML;
  }

  protected _clean(node: Node, _extraAllowedTags?: string[]) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();
      if (
        !this.allowedTags.has(tag) &&
        (!_extraAllowedTags || !_extraAllowedTags.includes(tag))
      ) {
        const parent = element.parentNode!;
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      } else {
        Array.from(element.childNodes).forEach((child) => this._clean(child));
      }
    }
  }
}
