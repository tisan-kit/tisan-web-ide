var express = require('express');
var router = express.Router();
var Remarkable = require('remarkable');
var md = new Remarkable();
var fs = require('fs');
var config = require('../config/index');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
    user: req.session.user,
    navigation:'index'
  });
});

router.get('/document/:page', function(req, res) {
  var page = req.params['page'];
  if(page.indexOf('.')!=-1) page=page.split('.')[0];

  console.log(page);
  fs.readFile(__dirname+'/../views/document/'+page+'.md','utf-8',function(err,data){
    res.render('document', { 
      user: req.session.user,
      page:page,
      navigation:'document',
      data:md.render(data)
    });
  })
});

router.get('/about', function(req, res){
  res.render('about', { 
    user: req.session.user,
    navigation:'about'
  });
})

router.get('/contribute', function(req, res){
  res.render('contribute', { 
    user: req.session.user,
    navigation:'contribute'
  });
})
router.get('/commercial', function(req, res){
  res.render('commercial', { 
    user: req.session.user,
    navigation:'commercial'
  });
})

router.get('/404',function(req,res){
  res.render('404',{
    user: req.session.user,
    navigation:'index'
  });
})
router.get('/500',function(req,res){
  res.render('500',{
    user: req.session.user,
    navigation:'index'
  });
})

module.exports = router;
