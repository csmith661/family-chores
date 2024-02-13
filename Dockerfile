# # using staged builds
# FROM node:18-buster as builder
# # make the directory where the project files will be stored
# RUN mkdir -p /usr/src/next-nginx
# # set it as the working directory so that we don't need to keep referencing it
# WORKDIR /usr/src/next-nginx
# # Copy the package.json file
# COPY package.json package.json
# # install project dependencies
# RUN npm install
# # copy project files 
# # make sure to set up .dockerignore to copy only necessary files


# COPY . .
# # run the build command which will build and export html files
# RUN npx prisma generate
# RUN npx prisma db seed && npm run build

# # bundle static assets with nginx
# FROM nginx:1.21.0-alpine as production
# ENV NODE_ENV production
# # remove existing files from nginx directory
# RUN rm -rf /usr/share/nginx/html/*
# # copy built assets from 'builder' stage
# COPY --from=builder /usr/src/next-nginx/out /usr/share/nginx/html
# # add nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# # expose port 80 for nginx
# EXPOSE 80
# # start nginx
# CMD ["nginx", "-g", "daemon off;"]


# FROM node:alpine

# # Set working directory
# WORKDIR /usr/app

# # Install PM2 globally
# RUN npm install --global pm2

# # Copy "package.json" and "package-lock.json" before other files
# # Utilise Docker cache to save re-installing dependencies if unchanged
# COPY ./package*.json ./

# # Install dependencies
# RUN npm install --production

# # Copy all files
# COPY ./ ./

# # Build app
# RUN npx prisma generate

# RUN npx prisma db seed && npm run build

# # Expose the listening port
# EXPOSE 3000

# # Run container as non-root (unprivileged) user
# # The "node" user is provided in the Node.js Alpine base image
# USER node

# # Launch app with PM2
# CMD [ "pm2-runtime", "start", "npm", "--", "start" ]


FROM node:18-alpine AS base
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate

RUN npx prisma db seed && npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]