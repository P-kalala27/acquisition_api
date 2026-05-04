# Acquisition API

This application is containerized using Docker and connects to Neon Database. We use Neon Local for ephemeral development branches and Neon Cloud for production.

## Environment Variables Setup

Before running the application, you need to configure your environment variables. The project uses separate `.env` files for development and production.

### Development (`.env.development`)

1. Create or open `.env.development`.
2. Add your Neon credentials to enable Neon Local proxy branching:
   ```env
   PORT=3000
   NEON_API_KEY=your_neon_api_key_here
   NEON_PROJECT_ID=your_neon_project_id_here
   DATABASE_URL=postgres://user:password@neon-local:5432/dbname
   ARCJET_KEY=your_arcjet_key_here
   ```
   _Note: `DATABASE_URL` connects through the `neon-local` container, not directly to the cloud._

### Production (`.env.production`)

1. Create or open `.env.production`.
2. Add your direct Neon Cloud connection string:
   ```env
   PORT=3000
   NODE_ENV=production
   DATABASE_URL=postgresql://neondb_owner:npg_WSg7eu...aws.neon.tech/neondb?sslmode=require
   ARCJET_KEY=your_arcjet_key_here
   ```

---

## Running in Development (Local)

The development setup spins up both the API and the **Neon Local** proxy. Neon Local will automatically create an ephemeral database branch when it starts and route your connection through it.

1. Ensure Docker is running.
2. Run the development environment using Docker Compose:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
3. The API will be available at `http://localhost:3000`. Hot-reloading is enabled; changes to `./src` will automatically restart the server.
4. To stop the development server and clean up (which will delete the ephemeral database branch):
   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

---

## Running in Production

The production setup uses the `Dockerfile` to build a lean image without hot-reloading and connects directly to the Neon Cloud database without the Neon Local proxy.

1. Ensure Docker is running.
2. Run the production environment using Docker Compose:
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```
3. To stop the production server:
   ```bash
   docker compose -f docker-compose.prod.yml down
   ```
