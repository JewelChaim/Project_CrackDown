This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment variables

A sample `.env` (and matching `.env.example`) is included. Update these values for your setup. In particular, set `NEXTAUTH_URL` to the actual domain of your deployment to avoid redirecting to `http://localhost:3000` during sign in.

If you're working in a GitHub Codespace, the public URL will look like `https://$CODESPACE_NAME-3000.app.github.dev`. Update `NEXTAUTH_URL` in your `.env` to match that address so authentication callbacks reach the codespace instead of `localhost`.

## Running in GitHub Codespaces

This repository ships with a [Dev Container](https://containers.dev/) configuration. To try it:

1. From the repository page, click **Code ➜ Create codespace on main**.
2. Wait for the container to build and dependencies to install.
3. Run `npm run dev` to start the Next.js server.

The development server will be available on port 3000 and forwarded to a public `app.github.dev` URL.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
