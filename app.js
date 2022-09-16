//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');

  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title:String,
  content: String
});
const Article = mongoose.model("Article", articleSchema);
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,articles){
    if(err) res.send(err);
    else res.send(articles);
  })
})
.post(function(req,res){
  const article=new Article({
    title:req.body.title,
    content:req.body.content
  })
  article.save(function(err){
    if(err) res.send(err);
    else res.send("Successfully added new article.");
  })
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err) res.send(err);
    else res.send("Successfully deleted all the articles.");
  })
});
app.route("/articles/:topic")
.get(function(req,res){
  Article.findOne({title:req.params.topic},function(err,article){
    if(article) res.send(article);
    else res.send("No articles matching that title was found.");
  })
})
.put(function(req,res){
  Article.replaceOne({title:req.params.topic},
    {title:req.body.title,content:req.body.content},
    function(err){
    if(err) res.send(err);
    else res.send("Successfully updated the article.");
  })
})
.patch(function(req, res){
    Article.findOneAndUpdate(
        {title: req.params.topic},
        {
            title: req.body.title,
            content: req.body.content
        },
        function(err) {
            if (!err) {
                res.send("Successfutly updated one part of articte.");
            }
        }
    );
})
.delete(function(req,res){
  Article.deleteOne(
  {title:req.params.topic},
  function(err){
    if(err) res.send(err);
    else res.send("Successfully deleted the specific article.");
  }
  )
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
