FROM node:18-alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000

ENV PORT=3000
ENV MONGODB_URL=mongodb+srv://<your-mongodb-connection-string>
ENV JWT_SECRET=thisisasamplesecret
ENV JWT_ACCESS_EXPIRATION_MINUTES=30
ENV JWT_REFRESH_EXPIRATION_DAYS=30
ENV JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
ENV JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
ENV SMTP_HOST=email-server
ENV SMTP_PORT=587
ENV SMTP_USERNAME=email-server-username
ENV SMTP_PASSWORD=email-server-password
ENV EMAIL_FROM=support@yourapp.com

CMD ["yarn", "start"]
