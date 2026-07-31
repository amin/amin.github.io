export default [
  {
    name: "Loopland",
    // The real logo is a raster badge, so it goes through eleventy-img as an
    // <img> rather than being inlined. Yrco uses `logo` instead — a true vector
    // small enough to inline.
    logoImage: "/assets/images/loopland.png",
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
