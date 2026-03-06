# API Documentation

The StylistA backend is powered by an Express.js server.

## Base URL

All API routes are prefixed with `/api`.

## Current Endpoints

*Currently, no specific API endpoints are defined in `server/routes.ts`. The application primarily relies on local state management via `AppContext` and `AsyncStorage`.*

## Adding New Routes

To add a new API route:

1.  Open `server/routes.ts`.
2.  Define your route handler inside `registerRoutes`.
3.  Ensure the route is prefixed with `/api`.

Example:

```typescript
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from StylistA API!" });
});
```

## Data Models

The data models are defined in `shared/schema.ts` using Drizzle ORM.

-   **Users**: `users` table (id, username, password).

To add a new table:

1.  Open `shared/schema.ts`.
2.  Define the table schema using `pgTable`.
3.  Export the schema and types.
4.  Run `npm run db:push` to update the database.
