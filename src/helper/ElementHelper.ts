const isXOverflow = (el: HTMLElement, offset = 0) => {
  const { scrollWidth, clientWidth } = el;
  if (clientWidth <= 0) {
    return false;
  }
  const overFlow = scrollWidth + offset > clientWidth;
  return overFlow;
};

const isYOverflow = (el: HTMLElement, offset = 0) => {
  const { scrollHeight, clientHeight } = el;
  if (clientHeight <= 0) {
    return false;
  }
  const overFlow = scrollHeight + offset > clientHeight;
  return overFlow;
};
const ElementHelper = {
  isXOverflow,
  isYOverflow,
};

export default ElementHelper;
