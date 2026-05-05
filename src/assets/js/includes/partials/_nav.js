// Utils
import { determineStickyState } from "../../utils/_determineStickyState";
import { throttle } from "../../utils/_throttle";

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
let lastScrollY = window.scrollY;

/**
 * Initializes navigation: burger menu toggle, link click handling, and resize behavior.
 */
export default function initializeNavigation() {
  const burger = document.querySelector(SELECTORS.burger);
  const logotype = document.querySelector(".logotype a");
  const links = document.querySelectorAll(SELECTORS.links);

  setInitialActive(links);
  initializeObserver();

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

      links.forEach((link) => (link.dataset.inViewport = "false"));
      link.dataset.inViewport = "true";

      if (window.innerWidth < BREAKPOINT) {
        toggleNav(burger, links);
      }

      const target = link.getAttribute("data-target");
      scrollToTarget(target);

      scrollingTimer = setTimeout(() => {
        isScrolling = false;
        lastScrollY = window.scrollY;
      }, 650);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= BREAKPOINT) {
      burger.classList.remove(ACTIVE_CLASS);
      document
        .querySelector(SELECTORS.header)
        .classList.remove(NAV_OPEN_CLASS);
      links.forEach((link) => link.classList.remove(SLIDE_IN_CLASS));
    }
  });
}

/**
 * Sets the active link on page load based on scroll position.
 */
function setInitialActive(links) {
  const sections = Array.from(document.querySelectorAll(SELECTORS.sections));

  const active = sections.reduce((closest, section) => {
    const rect = section.getBoundingClientRect();
    const prevRect = closest.getBoundingClientRect();
    return Math.abs(rect.top) < Math.abs(prevRect.top) ? section : closest;
  });

  links.forEach((link) => (link.dataset.inViewport = "false"));
  toggleLink(links, active.dataset.linkId);
}

/**
 * Initialize observers to update link state if relevant section is in viewport.
 */
function initializeObserver() {
  const sections = Array.from(document.querySelectorAll(SELECTORS.sections));
  const links = document.querySelectorAll(SELECTORS.links);
  let isInitialLoad = true;

  const callback = (entries) => {
    if (isInitialLoad) {
      isInitialLoad = false;
      return;
    }

    if (isScrolling) return;

    const scrollingDown = window.scrollY > lastScrollY;
    lastScrollY = window.scrollY;

    entries.forEach((entry) => {
      if (scrollingDown && entry.isIntersecting) {
        links.forEach((link) => (link.dataset.inViewport = "false"));
        toggleLink(links, entry.target.dataset.linkId);
      } else if (!scrollingDown && !entry.isIntersecting) {
        const index = sections.indexOf(entry.target);
        const prevSection = sections[index - 1];

        links.forEach((link) => (link.dataset.inViewport = "false"));

        if (prevSection) {
          toggleLink(links, prevSection.dataset.linkId);
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: "-10% 0px -85% 0px",
    threshold: 0,
  });

  sections.forEach((section) => observer.observe(section));
}

function toggleLink(links, id) {
  links.forEach((link) => {
    if (link.dataset.linkId === id) {
      link.dataset.inViewport = "true";
    }
  });
}

/**
 * Toggles the burger button and animates menu items in or out with a stagger effect.
 */
function toggleNav(burger, links) {
  burger.classList.toggle(ACTIVE_CLASS);
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
