let stickyElementStyle = null;
let stickyElementTop = 0;

export function determineStickyState(element) {
  if (!stickyElementStyle) {
    stickyElementStyle = window.getComputedStyle(element);
    stickyElementTop = parseInt(stickyElementStyle.top, 10);
  }

  const currentTop = element.getBoundingClientRect().top;

  element.classList.toggle("is-sticky", currentTop <= stickyElementTop);
}
