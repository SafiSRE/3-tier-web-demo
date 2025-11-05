# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
# Install dev deps so vite is available for build
RUN npm install --silent
COPY . .
RUN npm run build

# Production stage - serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Remove default nginx config and add a simple one that handles SPA routing
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
