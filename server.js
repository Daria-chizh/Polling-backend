const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const uuid = require('uuid');
const faker = require('faker');

const app = new Koa();

app.use(cors());

let previousRequestTs = Date.now();

const generateRandomMessage = (now) => {
  const maxAge = now - previousRequestTs;
  const messageAge = Math.floor(Math.random() * maxAge);
  return {
    id: uuid.v4(),
    from: faker.internet.email(),
    subject: faker.random.words(4),
    body: faker.random.words(15),
    timestamp: now - messageAge,
  };
};

const generateRandomMessages = () => {
  const timestamp = Date.now();
  const messages = [
    generateRandomMessage(timestamp),
    generateRandomMessage(timestamp),
  ];
  previousRequestTs = timestamp;
  return { status: 'ok', timestamp, messages };
};

app.use((ctx) => {
  if (ctx.path !== '/messages/unread') {
    ctx.response.status = 404;
    return;
  }

  ctx.body = generateRandomMessages();
  ctx.status = 200;
});

http.createServer(app.callback()).listen(process.env.PORT || 5555, () => console.log('Server is working'));
