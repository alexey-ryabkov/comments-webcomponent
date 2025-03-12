import { SlotName, SlotWrappers } from '../types';

export { default as HTMLSanitizer } from './HTMLSanitizer';

export const processTimestamp = (value: number) => {
  const datetime = new Date(value);
  return {
    iso: datetime.toISOString(),
    humanized: prettyDateTime(datetime),
  };
};

export const prettyDateTime = (date = new Date()) => {
  const formattedDate = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year:
      date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
  const formattedTime = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${formattedTime}, ${formattedDate}`;
};

export const setElementHidden = (elem: HTMLElement | null, flag: boolean) => {
  if (elem) {
    elem.hidden = flag;
  }
};

export const setElementDisabled = (
  elem: HTMLButtonElement | HTMLInputElement | null,
  flag: boolean,
) => {
  if (elem) {
    elem.disabled = flag;
  }
};

export const getFlagAttrVal = (elem: HTMLElement, attrName: string) =>
  elem.getAttribute(attrName) !== null;

export const setFlagAttrVal = (
  elem: HTMLElement,
  attrName: string,
  val: boolean,
) => (val ? elem.setAttribute(attrName, '') : elem.removeAttribute(attrName));

export const querySlot = (elem: ParentNode, name?: SlotName) =>
  (elem.querySelector(
    name && SlotName.default !== name
      ? `slot[name="${name}"]`
      : 'slot:not([name])',
  ) ?? null) as HTMLSlotElement | null;

export const insertElem2slot = (
  component: HTMLElement,
  elem: Node,
  name = SlotName.default,
) => {
  if (elem instanceof HTMLElement && name != SlotName.default) {
    elem.setAttribute('slot', name);
  }
  component.appendChild(elem);
  return elem;
};

export const defaultCommentWrapper = () => {
  const elem = document.createElement('article');
  elem.setAttribute('aria-label', 'Комментарий');
  return elem;
};

export const _buildSlotElemsWrappers = () =>
  Object.fromEntries(
    Object.entries(SlotName).map(([a]) => [a, null]),
  ) as SlotWrappers;
