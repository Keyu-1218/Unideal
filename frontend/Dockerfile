# Use official Node.js 24 LTS image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Delete node_modules and package-lock.json for a clean install
RUN rm -rf node_modules
RUN rm -rf package-lock.json

RUN npm install
# RUN npm install -g node-gyp
# RUN npm install

# Start the app (update "server.js" to your entry point if different)
CMD npm run dev -- --host
# CMD ["sh", "-c", "while true; do sleep 3600; done"]