# AgriQueue — Live Web + Backend

This is the supplied AgriQueue HTML prototype packaged as a deployable Node/Express application.

## Run locally

1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run:

```bash
npm install
npm start
```

4. Open http://localhost:3000

## API endpoints

- GET `/api/health`
- GET `/api/centres`
- GET `/api/token/KRM-0342`
- POST `/api/auth/send-otp`
- POST `/api/auth/verify-otp`
- POST `/api/bookings`

The OTP and booking storage are **in-memory demo storage**. Restarting the server clears them. For a real SIH deployment, connect PostgreSQL/Redis and a real SMS/WhatsApp provider.

## Deploy

Push this folder to GitHub, then create a Render Web Service from the repository.

Build command:
`npm install`

Start command:
`npm start`

Render will provide a public HTTPS URL such as:
`https://your-service.onrender.com`

Because the frontend and API are served by the same Express service, you do not need a separate frontend URL.
