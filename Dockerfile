# FROM node:18-alpine

# WORKDIR /app

# COPY package.json .

# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 4173

# CMD ["npm", "run", "preview"]

FROM node:18-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application from Nginx
FROM nginx:stable-alpine

# Copy the build output from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]