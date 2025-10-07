# Use official Node.js 20 LTS image as base
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using yarn)
COPY package*.json ./

# Install dependencies (npm)
RUN npm install

# Copy all source files to container
COPY . .

# Build TypeScript files to JavaScript (output in dist/)
RUN npm run build

# Expose backend port 5000 to host
EXPOSE 5000

# Default command to run backend in dev mode using ts-node-dev (hot reload)
CMD ["npm", "run", "dev"]
