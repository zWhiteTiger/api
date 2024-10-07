# Use the official Node.js image as a base
FROM node:21

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN yarn

# Copy the rest of your application code
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the port that the app runs on
EXPOSE 4444

# Command to run the application
CMD ["node", "dist/main.js"]
