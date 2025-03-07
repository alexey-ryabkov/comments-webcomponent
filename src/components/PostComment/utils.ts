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
