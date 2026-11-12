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

## Caching strategy

The coffee API service caches the hot coffee response in memory under the `coffee:hot` key for five minutes. `/items` and `/dashboard` share the same cached result. After expiry, the next request fetches fresh data. The service exports `invalidateCoffeeCache()` for use after any future create, update, or delete operation; those mutations should invalidate `coffee:hot`. Request IDs in the hook prevent an older response from replacing a newer request's result.

## Deployment

Deploy as a Vite single-page application and configure the same `VITE_FIREBASE_*` variables in the hosting provider. Add the deployed domain to Firebase Authentication's Authorized domains. Vercel SPA rewrites are included in `vercel.json`.
