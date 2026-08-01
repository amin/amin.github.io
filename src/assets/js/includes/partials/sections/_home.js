import { randomInt } from "../../../utils/_randomNumber";

const WORDS = [
  "code",
  "PHP",
  "JavaScript",
  "HTML",
  "Laravel",
  "Next.js",
  "CSS",
];

export default function typewriter() {
  const typewriter = document.querySelector(".typewriter");
  if (!typewriter) return;

  // Anyone who has asked for reduced motion keeps the word already in the
  // markup instead. "I translate visions into reality." stands on its own, so
  // nothing is lost by not animating it.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let wordIndex = 0;

  function erase(callback) {
    if (!typewriter.textContent.length) return callback();
    typewriter.textContent = typewriter.textContent.slice(0, -1);
    setTimeout(() => erase(callback), randomInt(100, 300));
  }

  function type(word, callback) {
    const current = typewriter.textContent.length;
    if (current === word.length) return setTimeout(() => erase(callback), 6000);
    typewriter.textContent = word.slice(0, current + 1);
    setTimeout(() => type(word, callback), randomInt(150, 400));
  }

  function loop() {
    type(WORDS[wordIndex], () => {
      wordIndex = (wordIndex + 1) % WORDS.length;
      loop();
    });
  }

  loop();
}
