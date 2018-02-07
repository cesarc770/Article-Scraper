var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var request = require("request");


//define the mongo URI depending on the environment 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Require all models
var db = require('./models');

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Handlebars setup
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  
});


//Routes

//route for main page
app.get("/", function(req, res){
	//render handlebars template
res.render('index', {
            layout: 'homepage'
        });
});

// A GET route for scraping the Fox Sports Soccer Website
app.get("/api/scrape", function(req, res) {
	var count = 0;
	var array = [];
  // First, we grab the body of the html with request
  request.get("https://www.foxsports.com/soccer" , function(err, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $(".trending-item a").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .attr("title");

      result.link = $(this)
        .attr("href");


   //logic to make sure we have articles with a link and a title and that are unique as well from the scrape
     if(result.title != null){
     	if(result.title != ""){
     		db.Article.findOne(
     			{
     				title : result.title
     			})
     		 .then(function(data){
     			if(data == null){
     				db.Article
			        .create(result)
			        .then(function(dbArticle) {
			          // View the added result in the console
			        })
			        .catch(function(err) {
			          // If an error occurred, send it to the client
			          return res.json(err);
			        });
			      
     			}
	   			
     		})
     	}

     }
       
    
  });
    
 });

});

//a get route to show scraped articles
app.get("/scraped", function(req, res){
	db.Article.find({})
	.then(function(data){
		res.json(data);
	})
	.catch(function(err){
		return res.json(err);
	})
});

//route to update articles and show them as saved them 
app.post("/save/:id", function(req, res){
	db.Article.update(
	{
		_id : req.params.id
	},
	{
		$set: {"isSaved": true}
	})
	.then(function(){
		res.send("Article Saved");
	})
});

//route to get articles thta have been saved
app.get("/saved", function(req, res){
	//render handlebars template
res.render('saved', {
            layout: 'main'
        });
});

//route to api for saved articles 
app.get("/api/saved", function(req, res){
	 db.Article.find({isSaved : true})
	.then(function(data){
		res.json(data);
	})
	.catch(function(err){
		return res.json(err);
	})
});

//route to delete saved articles
app.post("/delete/:id", function(req, res){
	console.log("get here");
	db.Article.update(
	{
		_id : req.params.id
	},
	{
		$set: {"isSaved": false}
	})
	.then(function(data){
		res.send("Article Deleted from saved");
	})
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/notes/:id", function(req, res) {
 
   db.Article.findOne(
   {
    _id : req.params.id
   })
   .populate("note")
   .then(function(data){
   res.json(data);
  })
  .catch(function(err){
    res.json(err);
  })
});

app.post("/notes/:id", function(req, res) {
  // save the new note that gets posted to the Notes collection
  db.Note
    .create(req.body)
  // then find an article from the req.params.id
  .then(function(dbNote){
    // and update it's "note" property with the _id of the new note
    return db.Article.findOneAndUpdate(
    {
      _id : req.params.id
    },
     { $push: { note: dbNote._id } }, { new: true });
  })
  .then(function(dbArticle) {
      // If the Article was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  
});




// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});