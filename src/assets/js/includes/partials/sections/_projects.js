const DETAILS_SELECTOR = ".project-details";
const CONTENT_SELECTOR = ".project-details-content";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DURATION = 250;
// Marks the window between a close starting and [open] catching up. Only ever
// set by this file, so with no script the summary keeps reading [open] alone.
const CLOSING_CLASS = "is-closing";

/**
 * Gives the native project disclosures the same measured height transition in
 * every browser. Without JavaScript (or Web Animations support), <details>
 * keeps its built-in toggle behaviour and the content simply opens at once.
 */
export default function initializeProjectDetails() {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

  document.querySelectorAll(DETAILS_SELECTOR).forEach((details) => {
    const summary = details.querySelector(":scope > summary");
    const content = details.querySelector(`:scope > ${CONTENT_SELECTOR}`);

    if (!summary || !content || typeof content.animate !== "function") return;

    let animation = null;
    let targetOpen = details.open;

    const finish = (open, completedAnimation = animation) => {
      // Pin the endpoint before removing `fill: forwards`, then return the
      // wrapper to its natural height so responsive reflow still works.
      content.style.height = open ? `${content.scrollHeight}px` : "0px";
      if (completedAnimation) completedAnimation.cancel();
      details.open = open;
      details.classList.remove(CLOSING_CLASS);
      content.style.height = "";
      if (animation === completedAnimation) animation = null;
      targetOpen = open;
    };

    const animateTo = (open) => {
      // Firefox reports the natural rectangle of descendants inside a closed
      // <details>, even though they are not painted. The semantic state is the
      // reliable source for the closed endpoint.
      const currentHeight = details.open
        ? content.getBoundingClientRect().height
        : 0;

      if (animation) animation.cancel();

      // The summary takes its state from [open], and [open] cannot flip at the
      // start of a close: a shut <details> has nothing left to animate, which
      // is why finish() defers it. Opening therefore turned the label and the
      // chevron immediately while closing left them 250ms behind the panel,
      // and a label changing after the motion has stopped reads as lag. This
      // marks that window so the CSS can treat it as already shut.
      details.classList.toggle(CLOSING_CLASS, !open);

      // Closed <details> content cannot be measured. Open it before reading
      // scrollHeight; the animation is installed in the same frame, so the
      // natural-height state is never painted first.
      if (open && !details.open) details.open = true;

      const fullHeight = content.scrollHeight;
      const endHeight = open ? fullHeight : 0;

      content.style.height = `${currentHeight}px`;
      targetOpen = open;
      const nextAnimation = content.animate(
        [
          { height: `${currentHeight}px` },
          { height: `${endHeight}px` },
        ],
        {
          duration: DURATION,
          easing: "ease",
          fill: "forwards",
        },
      );

      animation = nextAnimation;
      nextAnimation.addEventListener(
        "finish",
        () => finish(open, nextAnimation),
        { once: true },
      );
    };

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const open = !targetOpen;

      if (reducedMotion.matches) {
        if (animation) animation.cancel();
        finish(open);
        return;
      }

      animateTo(open);
    });

    // Keep the target synchronized if the browser opens a disclosure itself,
    // for example while revealing a find-in-page match.
    details.addEventListener("toggle", () => {
      if (!animation) targetOpen = details.open;
    });
  });
}
