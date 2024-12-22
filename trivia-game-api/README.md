# Marche-Assessment

For solving TicketsMarche assessment.

# Project Folder Structure

# Trivia Game API

## Folder Structure

```plaintext
trivia-game-api/
|__ prisma
|   └── schema.prisma           # Database schemas
├── src/
│   ├── controllers/            # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── game.controller.ts
│   │
│   ├── services/               # Business logic
│   │   ├── auth.service.ts
│   │   ├── game.service.ts
│   │   ├── decorators/
│   │   │   └── role.decorator.ts
│   │   ├── enums/
│   │   │   ├── error-code.enum.ts
│   │   │   ├── game-status.enum.ts
│   │   │   └── role.enum.ts
│   │
│   ├── repositories/           # DB interactions
│   │   ├── user.repository.ts
│   │   ├── game.repository.ts
│   │   ├── leaderboard.repository.ts
│   │   └── question.repository.ts
│   │
│   ├── routes/                 # Express routes
│   │   ├── auth.routes.ts
│   │   ├── game.routes.ts
│   │
│   ├── middlewares/            # Middleware
│   │   ├── auth.middleware.ts
│   │   └── exception.middleware.ts
│   │
│   ├── exceptions/             # Custom exceptions
│   │   ├── bad-request-exception.ts
│   │   ├── forbidden-exception.ts
│   │   ├── http-exception.ts
│   │   └── un-authorized-exception.ts
│   │
│   ├── types/                  # Type definitions
│   │   └── submit-answer.ts
│   │
│   ├── utils/                  # Utility functions
│   │   └── trivia.api.ts       # Fetch questions from external API
│   │
│   ├── tests/                  # Jest test cases
│   │   ├── auth.test.ts
│   │   ├── game.test.ts
│   │
│   ├── server.ts               # Application entry point
│   └── app.ts                  # Express app setup
├── Dockerfile                  # Docker container setup
├── docker-compose.yml          # Docker Compose for multi-container setup
├── .env                        # Environment variables
├── prisma/schema.prisma        # Prisma schema definition
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies


## Project Description

This project is a **Trivia Game API** designed and implemented to manage various functionalities of a trivia game. The main goal of the project is to provide a scalable and maintainable architecture, ensuring smooth API operations for authentication, gameplay, leaderboard management, and more.

### Features and Accomplishments

#### Controllers
- Handled routes for:
  - User authentication.
  - Game operations.

#### Services
- Encapsulated business logic, including:
  - **Role-Based Access Control**: Implemented using custom decorators (`role.decorator.ts`).
  - **Enums**: Defined for error codes, game statuses, and roles to enhance code readability and consistency.

#### Repositories
- Managed database interactions:
  - User management.
  - Game data operations.
  - Leaderboard updates.
  - Question storage and retrieval.

#### Middleware
- **Auth Middleware**: Secures access to protected routes.
- **Exception Middleware**: Handles errors gracefully, ensuring structured responses.

#### Exceptions
- Defined custom exceptions to streamline error handling, such as:
  - `BadRequestException`
  - `ForbiddenException`
  - `HttpException`
  - `UnauthorizedException`

#### Utility Functions
- Implemented utilities for:
  - External API integration (e.g., fetching trivia questions).
  - Secure token management using JWT.

#### Testing
- Added Jest test cases to ensure:
  - Authentication reliability.
  - Correctness of game logic.

#### Types
- Defined reusable types:
  - Example: `submit-answer.ts` for strongly-typed request/response objects.

#### Dockerized Deployment
- Prepared deployment setup:
  - `Dockerfile` for containerized builds.
  - `docker-compose.yml` for multi-container setups.

#### Database Schema
- Designed and managed using **Prisma**:
  - Ensures robust and scalable database structure.

#### Project Standards
- Adopted a **modular folder structure** for clear separation of concerns.
- Followed **TypeScript best practices** for type safety and maintainability.

---

### Summary
The **Trivia Game API** project demonstrates robust backend development practices with a focus on scalability, performance, and clean architecture. It efficiently supports core functionalities like authentication, gameplay, leaderboard management, and external integrations, ensuring a seamless experience for users and developers alike.
