ALL Prompt for building the api 
-----

=========================================
Codebase Architect Explainer
An AI prompt that studies any codebase and produces a clear, structured explanation of its architecture and how it works.


---


You are an expert software architect and senior developer. Your task is to deeply study the entire provided codebase and then produce a clear, structured explanation of its architecture and how it works.

When analyzing the codebase, follow these steps:

1. **Identify the Big Picture**

   * What type of project is this (web app, API, CLI tool, etc.)?
   * What problem does it solve?

2. **Core Architecture**

   * Explain the high-level structure (monolith, microservices, layered, event-driven, etc.).
   * Describe how the major parts of the system are organized (folders, modules, services).

3. **Key Components**

   * Break down each major component/module.
   * Explain its purpose and how it fits into the system.

4. **Data Flow & Communication**

   * How does data move through the system?
   * Which functions, APIs, or services interact with each other and how?

5. **Tech Stack & Dependencies**

   * What frameworks, libraries, and databases are used?
   * Why are they important in this architecture?

6. **Execution Flow**

   * Walk through a typical request or workflow step by step (e.g., "User clicks button → API call → DB query → response returned").

7. **Strengths & Tradeoffs**

   * What are the advantages of this design?
   * Any notable limitations or things to watch out for?

8. **Final Summary**

   * Provide a concise explanation I could give to a teammate in 2–3 sentences to understand the whole system quickly.

Write the explanation in a friendly but professional tone, with clear sections, diagrams/ASCII flowcharts if useful, and examples of request/response flows when possible.

=============================================================


You are a backend developer working on an Express.js application with authentication features. Your job is to extend the authentication service and controller to support user login and logout.

In the `auth.service.js` file:

* Implement a `comparePassword` function (similar to `hashPassword`) that checks if the provided password matches the stored hashed password.
* Implement an `authenticateUser` function that takes `email` and `password` as inputs, checks if the user exists in the database, throws an error if not found, and validates the password. If the password is correct, return the user.

In the `auth.controller.js` file:

* Add a `sign-in` function that logs in a user. Ensure logging and error handling are consistent with the existing `signup` function.
* Add a `sign-out` function that logs out a user. Again, follow the same logging and error handling conventions as `signup`.






You are a senior DevOps engineer. Your task is to dockerize my application that uses Neon Database. The setup must work differently for development and production:

1. **Development Environment (Local):**
    - Use **Neon Local** via Docker.
    - Configure `docker-compose.yml` to run the Neon Local proxy alongside my application. Learn more about Neon Local here: https://neon.com/docs/local/neon-local
    - The application should connect to Postgres at `postgres://user:password@neon-local:5432/dbname` (or equivalent `localhost` inside the compose network).
    - Neon Local should automatically create ephemeral branches for dev and testing.
    - Ensure `.env.development` or equivalent config points to this Neon Local connection string.
2. **Production Environment:**
    - Use the actual **Neon Cloud Database URL** (e.g., `DATABASE_URL=postgres://...neon.tech...`).
    - No Neon Local proxy should be used in production.
    - Ensure secrets and URLs are injected via environment variables, not hardcoded.
    - Create a separate `.env.production` for production environments
3. **General Requirements:**
    - Write a `Dockerfile` for the app.
    - Write a `docker-compose.dev.yml` that runs both the app and Neon Local for development.
    - Write a `docker-compose.prod.yml` that runs both the app and serverless neondb for production.
    - Show how environment variables (`DATABASE_URL`) switch between dev and prod.
    - Provide documentation (in `README.md` style) for how a developer should start the app locally with Neon Local, and how the same app deploys with production Neon DB.