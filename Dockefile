# 1. Build the app
FROM node:18-alpine as builder
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm run build

# 2. Install production packages, copy over build files, set run-command
FROM node:18-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
RUN npm install -g pm2
COPY --from=builder /usr/app/dist ./dist
CMD ["pm2", "start", "dist/index.js"]