# Base Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including TensorFlow.js)
RUN npm install @tensorflow/tfjs-node express body-parser cors

# Copy rest of the server code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
