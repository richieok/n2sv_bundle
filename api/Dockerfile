FROM node:alpine

# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
COPY app.js ./
COPY aws.js ./

RUN npm install
