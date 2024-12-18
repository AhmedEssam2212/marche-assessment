# marche-assessment
For Solving TicketsMarche assessment.
# Project Folder Structure
trivia-game-api/
│
├── src/
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── game.controller.ts
│   │   └── leaderboard.controller.ts
│   │
│   ├── services/              # Business logic
│   │   ├── auth.service.ts
│   │   ├── game.service.ts
│   │   └── leaderboard.service.ts
│   │
│   ├── repositories/          # DB interactions
│   │   ├── user.repository.ts
│   │   ├── game.repository.ts
│   │   └── score.repository.ts
│   │
│   ├── models/                # Database schemas
│   │   └── prisma/            # Prisma auto-generated client files
│   │
│   ├── routes/                # Express routes
│   │   ├── auth.routes.ts
│   │   ├── game.routes.ts
│   │   └── leaderboard.routes.ts
│   │
│   ├── middlewares/           # Auth middleware
│   │   └── auth.middleware.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── trivia.api.ts      # Fetch questions from external API
│   │   └── jwt.utils.ts       # JWT generation/validation
│   │
│   ├── tests/                 # Jest test cases
│   ├── server.ts              # Application entry point
│   └── app.ts                 # Express app setup
│
├── Dockerfile
├── docker-compose.yml
├── .env                       # Environment variables
├── prisma/schema.prisma       # Prisma schema definition
├── tsconfig.json              # TypeScript config
└── package.json

