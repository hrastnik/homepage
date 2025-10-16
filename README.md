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

## Drag & Resize Dashboard Layout

The main dashboard (`src/app/page.tsx`) now uses `react-grid-layout` for a fully draggable and resizable experience.

Features:

- Drag panels by their header bar (shows a move cursor).
- Resize panels using any edge or corner handle.
- Layout automatically persists to `localStorage` under key `dashboard.layout.v1`.
- Click "Reset layout" button to restore default arrangement.

Implementation notes:

- Breakpoints: `lg(>=1200):12 cols`, `md:10`, `sm:6`, `xs:4`, `xxs:2`.
- Row height is `20`px; panel height units multiply this value.
- Minimum sizes enforced per item to prevent accidental collapse.
- To adjust defaults edit `defaultLayouts` in `page.tsx`.

Potential next improvements:

- Add a "Lock layout" toggle to prevent accidental moves.
- Introduce server-side user specific layouts (persist beyond device).
- Add a "Share layout" export button (downloads JSON).
- Provide per-breakpoint tailored defaults.

If layout rendering breaks after dependency upgrades to React 19 stable, re-check `react-grid-layout` version compatibility and remove the temporary `as any` cast at component creation.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
