# Use a base image of Node.js
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port your app runs on (if applicable)
EXPOSE 3000

# Command to run the app using your existing 'start' script
CMD ["npm", "start"]