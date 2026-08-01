export default [
  {
    name: "Loopland",
    // Redrawn as vector geometry. The only wordmark that ships with the project
    // is baked into an illustrated badge, with a rollercoaster painted over one
    // of its letters, so it could not be cropped or repaired. This is built to
    // the original's measured proportions — stroke is 0.21 of cap height — in
    // its sampled colours. Replace it if a clean export ever comes out of the
    // Affinity source.
    logo: "icons/brand/loopland.svg",
    description:
      "A digital amusement park, built around Centralbank — a Laravel API we wrote so the rest of our class could plug in their own amusements, the games and attractions that fill the park. Each is issued an API key and runs its transactions through Centralbank, acting on a player's behalf with a short-lived identity token rather than their credentials. Players earn stamps as they play, exchange matching sets for currency, and finish on a shared leaderboard.",
    tech: [
      "icons/php.svg",
      "icons/laravel.svg",
      "icons/react.svg",
      "icons/typescript.svg",
      "icons/tailwind.svg",
      "icons/sql.svg",
      "icons/turborepo.svg",
      "icons/pnpm.svg",
    ],
    links: {
      live: "https://loopland.se",
      github: "https://github.com/amin/loopland",
    },
  },
  {
    name: "Yrco",
    logo: "icons/brand/yrco.svg",
    description:
      "A networking app for the evening Yrgo's design and web development students meet the industry. Everyone who attends picks seven traits that define them, and those traits become a palette that is theirs alone — so you can read the room by colour, find the people who complement you, and leave with the connections worth keeping.",
    tech: [
      "icons/javascript.svg",
      "icons/react.svg",
      "icons/nodejs.svg",
      "icons/mongodb.svg",
      "icons/tailwind.svg",
      "icons/turborepo.svg",
      "icons/pnpm.svg",
    ],
    links: {
      live: "https://yrco.se",
      github: "https://github.com/amin/yrco",
    },
  },
];
