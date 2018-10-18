"use strict";

const path = require('path');
const fs = require('fs');
const request = require('request');

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const PORT = 3000 || process.env.PORT;

let getBitcoin = time => {
  return new Promise((resolve, reject) => {
    request.post({ url: `https://quotes.fxclub.org/quotes.json?_${time}` }, (err, httpResponse, body) => {
      resolve(body);
    })
  });
};

const parser = require('json-parser');

router.get('/', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.resolve(__dirname, 'index.html'));
  await next();
});

router.post('/', async (ctx, next) => {
  let data = await getBitcoin(ctx.request.body.time || Date.now());
  data = JSON.parse(`{${data.match(/"BTCUSD":{(.*?)}/).pop()}}`)['bid-fast'];

  ctx.body = { cost: data };

  await next();
});

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(serve(path.resolve(__dirname, 'public')));
app.use(bodyParser());
app.use(router.routes());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.status = err.statusCode || err.status || 500;

    ctx.body = {code: err.statusCode, message: err.message};
  }
})

app.listen(PORT, () => {
  console.log(`Server work on port ${PORT}...`);
});
