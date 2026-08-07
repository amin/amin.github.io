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
      "A digital amusement park assembled from games each group in our class built on its own. Players earn stamps in any of them, trade matching sets for currency, vote for their favourites, and compete on one shared leaderboard.",
    role: "In a team of three, I led the Centralbank API — the Laravel service, its OpenAPI contract, and its Railway deployment alongside the park's React front-end.",
    architecture:
      "Contract-first: the OpenAPI spec was published before any client existed, because the code calling it was being written by other groups. Per-game keys and short-lived identity tokens let a game act for a player without ever seeing their credentials.",
    tech: [
      "icons/php.svg",
      "icons/laravel.svg",
      "icons/react.svg",
      "icons/typescript.svg",
      "icons/tailwind.svg",
      "icons/sql.svg",
      "icons/turborepo.svg",
      "icons/pnpm.svg",
      "icons/railway.svg",
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
      "A networking app built for an event where Yrgo’s design and web development students meet people from the industry. Attendees choose seven traits that form a personal colour palette, making it easier to find complementary people and meaningful connections.",
    role: "Built with one classmate. I owned the architecture and most of the implementation, and deployed it on Railway.",
    architecture:
      "A layered Express API — routes, controllers, use cases, repositories — with one Zod schema package shared by client and server, so both validate against the same contract. Sessions are opaque DB-backed tokens, not JWTs.",
    tech: [
      "icons/javascript.svg",
      "icons/react.svg",
      "icons/nodejs.svg",
      // The architecture line above leads with "A layered Express API", so the
      // row named the runtime and omitted the framework the entry is about.
      "icons/express.svg",
      "icons/mongodb.svg",
      "icons/tailwind.svg",
      "icons/turborepo.svg",
      "icons/pnpm.svg",
      "icons/railway.svg",
    ],
    links: {
      live: "https://yrco.se",
      github: "https://github.com/amin/yrco",
    },
  },
];
