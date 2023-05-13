# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code to the working directory
COPY . .

# Expose the port the app will run on
EXPOSE 80

# Start the application
CMD ["npm", "start"]
