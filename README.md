# Alex Charnock Portfolio

This is a Next.js 16 portfolio rebuilt from the supplied Claude Design export. It is configured for static export, so `npm run build` creates a deployable site in `out/`.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Images supplied with the design live in `public/images`. The source design refers to `Alex-Charnock-CV.pdf`, but that file was not included in the ZIP; add it to `public/` before deploying if the CV buttons should work.
