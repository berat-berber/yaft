FROM node:22-alpine

WORKDIR /usr/src/app

# Update npm to fix potential "Exit handler never called!" issues on alpine
RUN npm install -g npm@latest

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy remaining source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]