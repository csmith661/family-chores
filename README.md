The family chores app is an in progress chores app that I currently use in my house! It is a t3 stack application using prisma designed to help my wife and I keep track of daily, weekly, and monthly chores. It also features a todo list.

It runs on a raspberry pi zero configured as a server, and is consumed by another raspeberry pi in our house and runs 24/7. It has been dockerized for ease of CI/CD

- Next.js
- NextAuth.js
- Prisma
- Tailwind CSS
- tRPC
- React Query
- TypeScript
- Docker

## Installation

1. Clone the project repository and pull to local environment

2. Create a `.env` file in the root directory and add the following

```
# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
# Create an account on [PlanetScale](https://app.planetscale.com/) and create a new database (for storing user and video data)
DATABASE_URL=''


```

4. Install dependencies and run the dev server

```
npm install
npm run dev

```

5. For the database client Prisma Studio, run the following command:

```
npx prisma studio
```
