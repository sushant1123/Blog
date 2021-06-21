//jshint esversion:6

const express = require("express");
const mongooose = require("mongoose"); 
const ejs = require("ejs");
const _ = require("lodash");
const {USERNAME, PASSWORD} = require("./secret.js");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//connecting to the URL
const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.hxqnm.mongodb.net`;

mongooose.connect(URL + "/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

//creating a schema
const PostSchema = new mongooose.Schema({
    title: String,
    content: String
});

//creating a model using that schema
const PostModel = mongooose.model("Post", PostSchema);

let posts = [];

app.get("/", function(req, res){
    PostModel.find({}, (err, posts)=>{
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
    
});

app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
    res.render("compose");
});

app.post("/compose", function(req, res){
    
    const pTitle = _.capitalize(req.body.postTitle);
    const pContent = req.body.postBody;

    const post = new PostModel(
        {
            title: pTitle,
            content: pContent
        }
    );
    console.log(post);
    post.save((err)=>{
        if(!err){
            res.redirect("/");
        }
    });
});

app.get("/posts/:postID", function(req, res){
    const postID = req.params.postID;
    //console.log(postID);

    PostModel.findOne({_id: postID}, (err, post)=>{
        if(!err){
            res.render("post", {
                title: post.title,
                content: post.content
            })
        }else{
            console.log(err);
        }    
    }); 
        /* const storedTitle = _.lowerCase(post.title);

        if (storedTitle === requestedTitle) {
        res.render("post", {
            title: post.title,
            content: post.content
        });
        } */
});

let port = process.env.PORT;
if(port == "" || port == null){
    port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port "+ port);
});
