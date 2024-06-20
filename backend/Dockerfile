FROM node:18

RUN useradd -ms /bin/bash appuser

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R appuser /app

USER appuser

RUN npm run build

RUN echo '[]' > dist/taskLogs.json

EXPOSE 3000

CMD ["npm", "start"]