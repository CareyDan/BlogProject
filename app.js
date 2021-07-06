// Wiki-API/app.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbName = process.env.DB_NAME
const appPort = process.env.APP_PORT

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const uri = "mongodb://" + dbHost + ":" + dbPort + "/" + dbName;
const uri = "mongodb+srv://" + dbUser + ":" + dbPass + "@cluster0.25aqz.mongodb.net/" + dbName + "?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true });

let port = process.env.PORT;
if (port == null || port == "") { port = appPort; }
app.listen(port, function() { console.log("Server started on port: " + port); });

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postsSchema = {
  title: String,
  body: String
}
const Post = mongoose.model("Post", postsSchema);

app.get("/posts/:route", (req,res)=>{
  var str = req.params.route;
  var route = str.replace(":", "");
  console.log(route);
  Post.findOne({"title": route}, (err, result)=>{
    res.render("post", {postTitle: result.title, postBody: result.body });
  });

  // posts.forEach((post)=>{
  //   let found = false;
  //   if (_.lowerCase(req.params.route) === _.lowerCase(post.title)) {
  //     console.log("Match found.");
  //     res.render("post", {postTitle: post.title, postBody: post.body });
  //     found = true;
  //   }
  //   if (!found) {
  //     console.log("Match not found.");
  //   }
  // });
  // console.log(req.params.route);
});

app.get("/", (req,res)=>{
  Post.find({}, (err, results)=>{
    //console.log(results);
    res.render("home", {homeText: homeStartingContent, postsArray: results});
  });
});

app.get("/about", (req,res)=>{
  res.render("about", {aboutText: aboutContent});
  //console.log("Get request logged for about.");
});

app.get("/contact", (req,res)=>{
  res.render("contact", {contactText: contactContent});
  //console.log("Get request logged for contact.");
});

app.get("/compose", (req,res)=>{
  res.render("compose");
  //console.log("Get request logged for compose.");
});

app.post("/compose", (req,res)=>{
  // const post = {
  //   title: req.body.postTitle,
  //   body: req.body.postBody
  // };
  // posts.push(post);

  const newPost = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  Post.create(newPost);
  res.redirect("/");
});
