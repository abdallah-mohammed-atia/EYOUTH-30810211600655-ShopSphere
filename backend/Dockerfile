FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npx prisma generate
RUN mkdir -p src/uploads

EXPOSE 5000

CMD ["node", "src/server.js"]