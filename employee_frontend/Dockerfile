# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["npm", "start"] 