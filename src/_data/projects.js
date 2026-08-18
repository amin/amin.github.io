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
      "A digital amusement park bringing together games developed independently by groups in our class, all connected through a central API our team built. Players earn stamps, trade matching sets for currency, vote for their favourites, and compete on one shared leaderboard.",
    role: "In a team of three developers, I was responsible for the Centralbank API: the Laravel service, its OpenAPI contract, and its Railway deployment.",
    architecture:
      "A Turborepo monorepo with a Laravel API and React SPA, built contract-first. The OpenAPI spec was published before any client existed, because the code calling it was being written by other groups. Per-game keys and short-lived identity tokens let a game act for a player without ever seeing their credentials.",
    tech: [
      "icons/php.svg",
      "icons/laravel.svg",
      "icons/react.svg",
      "icons/typescript.svg",
      "icons/tailwind.svg",
      "icons/postgresql.svg",
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
      "A mobile-only networking app designed for an in-person event where Yrgo’s design and web development students meet people from the industry. Attendees choose seven traits that form a personal colour palette, making it easier to find complementary people and meaningful connections.",
    role: "Built in a team of four: two digital designers and two developers. As one of the developers, I owned the architecture and most of the implementation, and deployed the app on Railway.",
    architecture:
      "A Turborepo monorepo: a layered Express API (routes, controllers, use cases, repositories), a React client, and one Zod schema package both apps import.",
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
    // This was an intentional product decision for the event rather than a
    // platform limitation. Named for the link it qualifies rather than as a
    // general `note`, so it cannot drift into an unbounded field.
    liveNote: "Mobile-only by design for an in-person networking event",
  },
];
