# AGENTS

- Use `src/lib/prisma.ts` for database access. It falls back to the local SQLite file when `DATABASE_URL` is not provided.
- Session objects include an optional `role`; see admin pages for the `AppSession` type to avoid `any` casts.
- Run `npm run lint` and `npm run build` before committing changes.
