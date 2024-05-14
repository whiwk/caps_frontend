FROM quay.tiplab.local/openetra/node:18.17.0-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]