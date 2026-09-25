# SnippetBox

SnippetBox is a TypeScript-based backend API for managing code and text snippets. Users can register, log in, create private or public snippets, update them, view version history, and restore previous versions.

## Overview

This project is built with Express.js and Prisma ORM, using PostgreSQL as the database. It exposes a RESTful API for snippet management and JWT-based authentication.

## Tech Stack

- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Zod validation
- JWT + bcrypt
- Cookie-based auth session handling

## Features

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Private and public snippet visibility
- Create, read, update, and delete snippets
- Snippet version tracking
- Restore previous snippet versions
- Request validation with Zod
- Error middleware for consistent API responses

## Project Structure

```bash
snippet-box/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   └── utils/
├── lib/
│   └── prisma.ts
├── generated/
│   └── prisma/
├── .env
├── package.json
├── prisma7.config.ts
├── tsconfig.json
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+
- PostgreSQL running locally or in a remote environment
- npm or pnpm

## Environment Setup

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/snippetbox"
```

## Installation

```bash
npm install
```

## Database Setup

Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

If you prefer to sync the schema without migration history during development:

```bash
npx prisma db push
```

## Run the Application

Start the dev server:

```bash
npm start
```

The server will run on the port defined in `PORT` (default: `3000`).

## Authentication API

### Register

```http
POST /auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Login

```http
POST /auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Logout

```http
POST /auth/logout
```

## Snippet API

All snippet routes require authentication unless otherwise noted.

### Create Snippet

```http
POST /snippet/create
```

Request body:

```json
{
  "title": "API Example",
  "content": "console.log('Hello world')",
  "language": "javascript",
  "isPublic": false
}
```

### Fetch Snippets

```http
GET /snippet/fetch
```

Returns snippets owned by the authenticated user and all public snippets.

### Fetch a Single Snippet

```http
GET /snippet/fetch/:id
```

### Update Snippet

```http
PATCH /snippet/update/:id
```

Request body:

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "language": "typescript",
  "isPublic": true
}
```

### Delete Snippet

```http
DELETE /snippet/delete/:id
```

### Fetch Snippet Version

```http
GET /snippet/fetchVersion/:id/versions/:versionId
```

### Restore Snippet Version

```http
POST /snippet/:id/versions/:versionId/restore
```

## Data Model

### User

- `id`
- `name`
- `email`
- `password`
- `createdAt`
- `updatedAt`

### Snippet

- `id`
- `title`
- `content`
- `language`
- `isPublic`
- `authorId`
- `createdAt`
- `updatedAt`

### SnippetVersion

- `id`
- `snippetId`
- `title`
- `content`
- `language`
- `createdAt`

## Notes

- The app uses a cookie-based JWT flow for auth.
- Snippet updates automatically create a version snapshot before modifying the current snippet.
- Public snippets are visible across users, while private snippets remain restricted to the owner.
- This project is currently a backend-focused application and does not include a frontend UI.

## Status

✅ Core API and data model are implemented

## Future Improvements

- Frontend client for snippet browsing and editing
- Search and filtering support
- Tagging and categories
- Pagination for large snippet sets
- Better test coverage and CI pipeline

