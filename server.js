// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quoting_dojo');
var QuoteSchema = new mongoose.Schema({
 name: String,
 quote: String,
 like: Number
}, {timestamps: true})
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote'); // We are retrieving this Schema from our Models, named 'User'
var bodyParser = require('body-parser');
var moment = require('moment');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './client/static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './client/views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes that process
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
})
//add new quote process
app.post('/quotes', function(req, res){
    var quote = new Quote({name: req.body.name, quote: req.body.quote, like: 0});
    quote.save(function(err){
      if(err){
        console.log('there is an error in /quotes, post method: ', err);
      }else{
        res.redirect('/quotes')
      }
    })
})
// quote page request
app.get('/quotes', function(req, res){
    Quote.find({}).sort({createdAt:-1}).exec(
      function(err, quotes){
      if(err){
        console.log('there is an error in /quotes, get method: ', err);
      }else{
        res.render('quotes', {quotes:quotes});
      }
    })
})
// get likes
app.post('/likes/:id', function(req, res){
  console.log("have a try");
    Quote.findOne({_id: req.params.id}, function(err, quote){
      quote.like = Number(req.body.like) + 1;
      console.log(quote.like);
      quote.save(function(err){
        if(!err){
          console.log("update successfully");
          if(req.body.sort == "time"){
          res.redirect('/quotes');
        }
          else if(req.body.sort == "popularity"){
            res.redirect('/sortbylike')
          }
        }
      })
    })

})
//post method for sorting by popularity
app.get('/sortbylike', function(req, res){
  Quote.find({}).sort({like:-1}).exec(
    function(err, quotes){
    if(err){
      console.log('there is an error in /quotes, get method: ', err);
    }else{

      res.render('quotesbypop', {quotes:quotes});
    }
  })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
