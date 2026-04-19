# LocalBiz Manager

LocalBiz Manager is a full-stack SaaS-ready billing and inventory application for small businesses.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT

## Features

- User registration and login
- JWT-protected API routes
- Responsive dashboard with sidebar navigation
- Light and dark theme with localStorage persistence
- Product CRUD with search and low-stock filtering
- Billing flow with live totals and stock validation
- Automatic stock deduction after successful sales
- Sales history with date filtering and revenue summary
- PDF invoice download for the latest sale
- CSV export for sales history
- Toast notifications, loading states, and error handling
- Subtle animated custom cursor on larger screens

## Folder Structure

### Backend

- `server/models`
- `server/routes`
- `server/controllers`
- `server/middleware`
- `server/config`

### Frontend

- `client/src/components`
- `client/src/pages`
- `client/src/hooks`
- `client/src/context`
- `client/src/services`

## Environment Variables

### Server: `server/.env`

Copy `server/.env.example` and update values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/localbiz-manager
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
```

### Client: `client/.env`

Copy `client/.env.example` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

## Setup

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running locally or point `MONGODB_URI` to MongoDB Atlas.

### 4. Run the backend

```bash
cd server
npm run dev
```

### 5. Run the frontend

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5000` by default.

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Sales

- `GET /api/sales/dashboard`
- `GET /api/sales`
- `POST /api/sales`

## Build Verification

Frontend production build verified with:

```bash
cd client
npm run build
```

Backend source syntax verified with:

```bash
cd server
Get-ChildItem src,controllers,routes,models,middleware,config -Recurse -File | ForEach-Object { node --check $_.FullName }
```

## Notes

- Sales creation validates stock before completing a bill.
- Product stock is updated with conditional database writes to prevent overselling under concurrent requests.
- The latest completed sale can be downloaded as a PDF invoice from the billing page.
- Sales history can be exported as CSV from the sales page.
