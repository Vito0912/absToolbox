FROM node:22-alpine AS builder

WORKDIR /app

COPY web/package*.json ./

RUN npm ci

COPY web/ ./

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]