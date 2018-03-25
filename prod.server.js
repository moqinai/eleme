const express = require('express');
const config = require('./config/index')

const port = process.env.PORT || config.build.port;

const app = express();

const router = express.Router();

router.get('/', (req, res, next) => {
  req.url = '/index.html';
  next();
});
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(router);


// 异步接口
const appData = require('./data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;

const apiRoutes = express.Router();

apiRoutes.get('/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);

// 定义express静态目录
app.use(express.static('./dist'));

 // 启动express
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:'+ port + '/n');
})
