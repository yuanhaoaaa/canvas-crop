
const   Koa = require('koa'),
        Router = require('koa-router'),
        fs = require('fs'),
        path = require('path'),
        app = new Koa(),
        router = new Router(),
        static = require('koa-static')

const resolve = pathname => path.resolve(__dirname, pathname)

app.use(static(resolve('./')))

router.get('/', ctx => {
    let html = fs.readFileSync('./canvas.html', 'utf8');
    ctx.body = html
})



app.use(router.routes())

app.listen(3000, () => {
    console.log('start 3000')
})