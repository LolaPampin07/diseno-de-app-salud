FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install -g @quasar/cli && npm install
EXPOSE 9200
CMD ["quasar", "dev", "-H", "0.0.0.0"]