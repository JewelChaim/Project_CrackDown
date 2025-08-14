# AGENTS

- Use `src/lib/prisma.ts` for database access. It falls back to the local SQLite file when `DATABASE_URL` is not provided.
- Session objects include an optional `role`; see admin pages for the `AppSession` type to avoid `any` casts.
- Install type definitions for third-party packages (e.g. `@types/*`) to prevent implicit `any` errors.
- Run `npm run lint` and `npm run build` before committing changes.
- Forms that call server actions must set `method="post"` so submissions trigger on button clicks.
