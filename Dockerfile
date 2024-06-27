FROM quay.tiplab.local/orca/node:18.17.0-base

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
