// Dependencies
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var axios = require('axios');
var exphbs = require('express-handlebars');
var morgan = require('morgan');


//Init Express
var app = express();


//require models
var db = require('./models');

var PORT = 3000;

//handlebars templating
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//morgan for logging requests
app.use(logger('dev'));
//body-parser to handle form submissions
app.use(bodyParser.urlencoded({ extended: true}));
//set up static folder
app.use(express.static('public'));

//connect to the Mongo DB
mongoose.connect('mongodb://localhost/didntRead');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function(){
  console.log("we're connected to mongoDB");
});

process.on('uncaughtException', function (err){
  console.log(err);
});


//scrape data from one site and place it into the mongoDB DB
axios.get('/scrape', function(req, res){
  //makes request from us news section of Wall Street Journal
  request('https://www.nytimes.com').then(function(response){
  //loads cheerio and assigns it to '$'  
  var $ = cheerio.load(response.data);

  //grabs article data
  $('article h2').each(function(i, element){
    var result ={};

    result.title = $(this)
      .children('a')
      .text();
    result.link = $(this)
      .children('a')
      .attr('href');
    result.summary = $(this)
      .children('p summary')
      .text();

    db.Article.create(result)
    .then(function(dbArticle) {
      console.log(dbArticle);
    })
    .catch(function(err){
      return res.json(err);
    });
  });
     // if scrape complete
     res.send('Scrape Complete');
  });
});

app.get('/articles', function(req,res){
  db.Article.find({})
    .then(function(dbArticle){

      res.json(dbArticle);
      })
    .catch(function(err) {

      res.json(err);
    });
});

app.get('/articles/:id', function(req,res){
  db.Article.findOne({ _id: req.params.id})
  .populate('comment')
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

app.post('/articles/:id', function(req, res){
  db.Comment.create(req.body)
  .then(function(dbComment){
    return db.Article.fundOneAndUpdate({ _id: req.params.id}, {note: dbComment._id}, {upsert: true}, {new: true});
  })
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});


app.listen(PORT, function(){
  console.log('app running on: ' + PORT);
});





