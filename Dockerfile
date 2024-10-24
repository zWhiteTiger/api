# Stage 1: Build the NestJS app
FROM node:21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a smaller runtime image
FROM node:21-alpine AS production

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage to the production stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose the port the app will run on
EXPOSE 3000

# Command to run the NestJS app
CMD ["node", "dist/main"]
