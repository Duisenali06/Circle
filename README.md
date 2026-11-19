# Steppe Coffee

React application built with Vite. It includes a coffee menu, searchable/filterable and sortable listings, pagination, a statistics dashboard, and Firebase Authentication.

- Repository: [Duisenali06/Circle](https://github.com/Duisenali06/Circle)
- Live application: deploy this version and add its URL here.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the Firebase Web App configuration values.
3. In Firebase Console, enable Email/Password and Google under Authentication → Sign-in method. Add the local and deployed hostnames to Authorized domains.
4. Start the app with `npm run dev`.

The Firebase web configuration uses Vite `VITE_` variables. Firebase web API keys identify the project and are included in client builds; access control belongs in Firebase Authentication and security rules. Keep `.env.local` out of Git.

## Authentication

Email/password signup and login, Google popup login, persistent browser sessions, and logout are provided through `AuthContext`. `/profile` is protected and shows the signed-in user's email and UID.

## PWA and offline use

The app is installable from supported browsers. `public/manifest.json` describes the app and its two icons. `public/sw.js` precaches the built HTML, JavaScript, CSS, icons, manifest, and offline page. The build writes a list of shell files and derives a cache version from their names, so a new build receives new caches and the old ones are removed on activation. When an update is ready, the app shows an **Обновить приложение** button.

The service worker uses network-first for the public coffee API and pages, and cache-first for images, icons, and fonts. Runtime caches have entry limits. Coffee menu responses are also stored locally in IndexedDB so `/items` and `/dashboard` can show the last fetched public data offline; the pages label that data as saved. Authentication responses are not stored. `/offline` provides a retry action when a page is not available.

## Caching strategy (in memory)

The coffee API service also keeps the hot coffee response in memory under the `coffee:hot` key for five minutes. `/items` and `/dashboard` share the same result while the app is open. The service exports `invalidateCoffeeCache()` for use after any future create, update, or delete operation. Request IDs in the hook prevent an older response from replacing a newer request's result.

## Deployment

Deploy as a Vite single-page application and configure the same `VITE_FIREBASE_*` variables in the hosting provider. Add the deployed domain to Firebase Authentication's Authorized domains. Vercel SPA rewrites are included in `vercel.json`.
