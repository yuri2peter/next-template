export function scrollToBottom(el: HTMLElement) {
  el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
}

export function scrollToTop(el: HTMLElement) {
  el.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Animates a ghost element moving from the position of element1 to element2.
 * @param startElement The starting element.
 * @param endElement The destination element.
 */
export function animateElementTransition(
  startElement: HTMLElement,
  endElement: HTMLElement
) {
  const {
    top: startY1,
    left: startX1,
    right: startX2,
    bottom: startY2,
  } = startElement.getBoundingClientRect();
  const {
    top: endY1,
    left: endX1,
    right: endX2,
    bottom: endY2,
  } = endElement.getBoundingClientRect();

  // Create the animation element
  const animationElement = document.createElement('div');
  Object.assign(animationElement.style, {
    position: 'fixed',
    transition: 'all 0.5s',
    opacity: '1',
    background: '#ffffffaa',
    width: `${startX2 - startX1}px`,
    height: `${startY2 - startY1}px`,
    left: `${startX1}px`,
    top: `${startY1}px`,
  });
  document.body.appendChild(animationElement);

  // Play the animation
  setTimeout(() => {
    Object.assign(animationElement.style, {
      opacity: '0',
      width: `${endX2 - endX1}px`,
      height: `${endY2 - endY1}px`,
      left: `${endX1}px`,
      top: `${endY1}px`,
    });
  });

  // Remove the animation element after the animation completes
  setTimeout(() => {
    document.body.removeChild(animationElement);
  }, 1000);
}
