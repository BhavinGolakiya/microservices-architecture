# Use Node.js v18 as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install all dependencies (defined in package.json)
RUN npm install

# Install nodemon globally (for development purposes)
# If you're running in production, you might skip this
RUN npm install -g nodemon

# Copy all source files after installing dependencies
COPY . .

# Expose the application port (replace if needed)
EXPOSE 5000

# Start the app using nodemon (can change to node for production)
CMD ["npx", "nodemon", "server.js"]
