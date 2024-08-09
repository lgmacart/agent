FROM node:iron-bullseye-slim

RUN apt-get update
RUN apt-get install -y procps
RUN apt-get install -y iproute2

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY server.mjs ./

ENV CONFIG_ENV=production
ENV NODE_ENV=production
ENV TERM=xterm
ENV AGENT_HOSTNAME="agent2"
ENV AGENT_ADDRESS="192.1.1.103:8081"

EXPOSE 2324

CMD ["npm", "run", "start"]