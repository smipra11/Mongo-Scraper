var express = require("express");
//var logger = require("morgan");
var bodyParser = require("body-parser")
var hbs = require("express-handlebars")
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var app = express();
var db = require("./models");
var PORT = 3000;

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Require all models
var db = require("./models");
// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Mngoscrapper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost/Mngoscrapper", { useNewUrlParser: true });

var PORT = 3000;


app.set('views', './views')
app.engine(
  "handlebars",
  hbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.get('/', function (req, res) {
  db.Article.find({ saved: false }, function (err, data) {
    res.render('index', { home: true, article: data });
  })
})

app.get('/save', function (req, res) {
  db.Article.find({ saved: true }, function (err, data) {
    res.render('save', { home: false, article: data });
  })
})


app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/").then(function (response) {
    //console.log(response)
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      var result = []

      // Add the text and href of every link, and save them as properties of the result object
      //headline = $(element).find('h2').text().trim();
      //console.log("title" + title)
      // Save the article url
      url=  'https://www.nytimes.com/' + $(element).find("a").attr("href");
      
      console.log(url)
      //console.log("url" +  articleURL)
      // Save the synopsis text
      summary = $(element).find("p").text().trim();
      // console.log("summary" + synopsis)

      result.push({
        headline: headline,
        url: url,
        summary: summary
      })


      console.log(result)
      if (headline !== "" & summary !== "") {
        db.Article.findOne({ headline: headline }, function (err, data) {
          if (err) {
            console.log(err)
          }
          else {
            if (data === null) {
              db.Article.create(result)
                .then(function (dbArticle) {
                  // View the added result in the console
                  console.log(dbArticle);
                })
                .catch(function (err) {
                  // If an error occurred, log it
                  console.log(err);
                });

            }
          }
        })
      }
      // Create a new Article using the `result` object built from scraping
      

    
      })
    
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.put("/articles/:id", function (req, res) {
  var saved = req.body.saved == 'true'
  if (saved) {
    db.Article.updateOne({ _id: req.body._id }, { $set: { saved: true } }, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
  }
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

