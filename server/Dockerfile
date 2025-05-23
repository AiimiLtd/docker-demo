FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./server/
WORKDIR /usr/src/app/server
RUN npm install --omit=dev

COPY src ./src

# For production, we might transpile server code, but @babel/register is simpler for this example.
# If you transpile server code, adjust CMD and COPY steps.

WORKDIR /usr/src/app/server

EXPOSE 8080
CMD ["node", "src/index.js"]