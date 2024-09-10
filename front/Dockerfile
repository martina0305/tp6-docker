# Use a base image of Node.js
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the working directory
COPY . .

# Build the frontend application (assuming React or Next.js)
RUN npm run build

# Expose the port for the app (adjust if necessary)
EXPOSE 8080

# Command to start the app (using React or Next.js's start script)
CMD ["npm", "start"]