var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); var http = require('http');
var config = require('./config/index');
var ExpressSession = require('express-session');
var RedisStore = require('connect-redis')(ExpressSession);
var _ =require('underscore');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//初始化redis
var redis = require('./db/redis').init();
//session setup
app.use(ExpressSession({
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({host:config.redis.host,port:config.redis.port}),
  rolling: true,
  secret: config.redis.sessionSecret,
  cookie: {
    maxAge: 1000*60*60*24*7
  }
}));// 

//TODO 写法有问题
app.use(function(req,res,next){
  if(req.path=='/'||req.path=='/about'||req.path.indexOf('qiniu')!=-1){
    next();
    return;
  }
  var str=(req.headers['user-agent']).toLowerCase();

  if(str.indexOf('webkit')==-1){
    res.render('download_chrome');
  }else{
    next();
  }
})

app.use('/', routes);
app.use('/user', require('./routes/user'));
app.use('/workspace', require('./routes/workspace'));
app.use('/qiniu', require('./routes/qiniu'));
app.use('/object', require('./routes/object'));
app.use('/product', require('./routes/product'));

var response = express.response,
  _render = response.render;
response.render = function(view, options, callback) {
  options = options || {}; 
  if (options) {
    _.extend(options, {
      staticUrl:"http://7xnf9k.com1.z0.glb.clouddn.com/@/",
    }); 
  }   
  console.log(options);
  _render.call(this, view, options, callback)
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404',{
    user:'',
    navigation:''
  })
});

// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('500',{
      user:'',
      navigation:''
    })
    res.end();
  });
}

var server = http.createServer(app);

server.listen(config.listenPort,function(result){
  console.log('Listen on port '+config.listenPort); 
})

module.exports = app;
