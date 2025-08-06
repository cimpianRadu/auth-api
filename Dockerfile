# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies
RUN npm install --include=dev

# Generate Prisma client
RUN npx prisma generate

# Install type definitions
RUN npm install --save-dev @types/cors

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "deploy:test"]