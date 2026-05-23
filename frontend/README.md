This is the Next.js frontend for the VedaAI Assessment Creator.

## Getting Started

Install dependencies, then run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

The project is configured to use the webpack compiler path for both development and production builds:

```bash
npm run lint
npm run build
```

The app intentionally uses local system fonts, so local builds do not require network access for font downloads.

## Routes

- `/dashboard`
- `/assignments/create`
- `/assignments/[id]`
- `/output/[id]`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
