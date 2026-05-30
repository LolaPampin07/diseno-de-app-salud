FROM node:18-slim

RUN apt-get update && \
    apt-get install -y \
      libreoffice \
      libreoffice-writer \
      fonts-dejavu \
      fonts-liberation \
      fonts-noto-color-emoji \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]