const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

// koa2 and mysql2 promise query example.
router.get('/database', async (ctx, next) => {
  const pool = ctx.db;
  const promisePool = pool.promise();
  const [rows, fields] = await promisePool.query("SELECT DATABASE() as `database`;");
  ctx.body = {
    database: rows[0]['database'],
  };
  console.log(rows)
})

module.exports = router
