# Production image for Render Web Service (root directory: backend).
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.js db.js helpers.js ./
COPY migrations ./migrations
COPY scripts ./scripts
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
