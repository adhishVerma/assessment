# Use official Node.js 20 LTS image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package files + yarn lock for deterministic installs
COPY package*.json yarn.lock ./

# Install dependencies (yarn)
RUN yarn

# Copy all frontend source files
COPY . .

# Expose port 5173 used by Vite dev server
EXPOSE 5173

# Start dev server, bind to all interfaces for access outside container
CMD ["yarn", "dev", "--host"]
