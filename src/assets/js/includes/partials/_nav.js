// Constants
const BREAKPOINT = 740;
const SLIDE_IN_CLASS = "activeSlideIn";
const ACTIVE_CLASS = "burger-active";
const NAV_OPEN_CLASS = "nav-open";
const ANIMATION_STAGGER_MS = 85;

// Selectors
const SELECTORS = {
  burger: ".burger",
  links: "nav.primary ul li a",
  sections: "section.section",
  header: "header.primary",
};

// State management
let isScrolling = false;
let scrollingTimer = null;

/**
 * Initializes navigation: burger menu toggle, link click handling, and resize behavior.
 */
export default function initializeNavigation() {
  const burger = document.querySelector(SELECTORS.burger);
  const logotype = document.querySelector(".logotype a");
  const links = document.querySelectorAll(SELECTORS.links);

  initializeSectionTracking(links);

  burger.addEventListener("click", (e) => toggleNav(e.currentTarget, links));
  logotype.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute("data-target");
    scrollToTarget(target);
  });

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      clearTimeout(scrollingTimer);
      isScrolling = true;

      links.forEach((other) => setInViewport(other, false));
      setInViewport(link, true);

      if (window.innerWidth < BREAKPOINT) {
        toggleNav(burger, links);
      }

      const target = link.getAttribute("data-target");
      scrollToTarget(target);

      scrollingTimer = setTimeout(() => {
        isScrolling = false;
      }, 650);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= BREAKPOINT) {
      burger.classList.remove(ACTIVE_CLASS);
      burger.setAttribute("aria-expanded", "false");
      document
        .querySelector(SELECTORS.header)
        .classList.remove(NAV_OPEN_CLASS);
      links.forEach((link) => link.classList.remove(SLIDE_IN_CLASS));
    }
  });
}

/**
 * Tracks the active section by computing it from scroll position on each scroll.
 *
 * The active section is the latest section whose top has scrolled past an
 * activation line at 40% of the viewport. When the page is at the bottom
 * (last section can't scroll its top past the line), the last section wins.
 */
function initializeSectionTracking(links) {
  const sections = Array.from(document.querySelectorAll(SELECTORS.sections));

  const updateActive = () => {
    if (isScrolling) return;

    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const vh = window.innerHeight;

    let active;
    if (vh + scrollY >= docHeight - 2) {
      active = sections[sections.length - 1];
    } else {
      const activationLine = scrollY + vh * 0.4;
      active = sections[0];
      for (const section of sections) {
        if (section.offsetTop <= activationLine) {
          active = section;
        } else {
          break;
        }
      }
    }

    const targetId = active.dataset.linkId;
    const currentLink = document.querySelector(
      'nav.primary a[data-in-viewport="true"]',
    );
    if (currentLink?.dataset.linkId === targetId) return;

    links.forEach((link) => setInViewport(link, false));
    toggleLink(links, targetId);
  };

  let scheduled = false;
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      updateActive();
      scheduled = false;
    });
  });

  updateActive();
}

function toggleLink(links, id) {
  links.forEach((link) => {
    if (link.dataset.linkId === id) {
      setInViewport(link, true);
    }
  });
}

/**
 * Marks a link as the section currently on screen, keeping aria-current in step
 * with the data attribute the styling hangs off.
 */
function setInViewport(link, isActive) {
  link.dataset.inViewport = String(isActive);
  if (isActive) {
    link.setAttribute("aria-current", "true");
  } else {
    link.removeAttribute("aria-current");
  }
}

/**
 * Toggles the burger button and animates menu items in or out with a stagger effect.
 */
function toggleNav(burger, links) {
  burger.classList.toggle(ACTIVE_CLASS);
  burger.setAttribute(
    "aria-expanded",
    String(burger.classList.contains(ACTIVE_CLASS)),
  );
  document.querySelector(SELECTORS.header).classList.toggle(NAV_OPEN_CLASS);

  const allActive = [...links].every((link) =>
    link.classList.contains(SLIDE_IN_CLASS),
  );

  const orderedItems = allActive ? [...links].reverse() : [...links];

  orderedItems.forEach((item, i) => {
    setTimeout(
      () => item.classList.toggle(SLIDE_IN_CLASS),
      (i + 1) * ANIMATION_STAGGER_MS,
    );
  });
}

/**
 * Scrolls smoothly to the element matching the given CSS selector.
 */
function scrollToTarget(selector) {
  const element = document.querySelector(selector);
  const headerHeight = document.querySelector(SELECTORS.header).offsetHeight;

  if (!element) {
    console.warn(`scrollToTarget: No element found for selector "${selector}"`);
    return;
  }

  animateScroll(element.offsetTop - headerHeight, 600);
}

/**
 * Smoothly animates the window scroll position to a target using an ease-in-out cubic curve.
 */
function animateScroll(targetPosition, duration = 500) {
  // Anyone who has asked for reduced motion is put where they asked to go
  // instead of being taken on a 600ms ride, same as the hero typewriter.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetPosition);
    return;
  }

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easedProgress);

    if (elapsed < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
