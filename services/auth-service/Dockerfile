# Use official Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally (optional for development only)
RUN npm install -g nodemon

# Copy the rest of the app
COPY . .

# Expose the port used by this service
EXPOSE 4000

# Start the app with nodemon (good for dev)
# For production: use ["node", "server.js"]
CMD ["npx", "nodemon", "server.js"]
