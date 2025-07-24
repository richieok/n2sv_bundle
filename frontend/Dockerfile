FROM node:alpine AS build
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine AS production
# Copy the built files from the build stage
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
RUN npm install --omit=dev
COPY ./static ./static
# COPY ./other-static-assets ./other-static-assets
# EXPOSE 3000
CMD ["node", "build/index.js"]