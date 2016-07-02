var express = require("express"); 
var bodyParser = require('body-parser');
var fs = require('fs');
var mustacheExpress = require('mustache-express');
var firebase = require("firebase/app");
  require("firebase/auth");
  require("firebase/database");

  // Leave out Storage
  //require("firebase/storage");

  var config = {
    // ...
  };
  firebase.initializeApp(config);


var app = express(); 

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');



app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post('/create-post', function (req, res){
	console.log(req.body);

	var newPostContent = req.body['blogpost']
	console.log(newPostContent);
	var newPostDate = Date.now()

	fs.readFile(__dirname + '/data/posts.json', function (error, file) {

		console.log(file.toString());
		var parsedFile = JSON.parse(file);


	    // parsedFile = newPostContent ==> replacing replacing parsedFile with newPostContent
	    parsedFile[newPostDate] = newPostContent; 
	    // // obj[name] = value; ==> adding/appending new key value into the existing JS object(obj)
	    //can also use fs.append 

	    console.log(parsedFile);
	    var newData = JSON.stringify(parsedFile)

	    fs.writeFile(__dirname + '/data/posts.json', newData, function (error) {
	    	res.redirect('/');
	    	console.log(newData);
	    });

	});



});



//for displaying the blog post JSON file on browser 
app.get('/get-posts', function (req, res){
	res.sendFile(__dirname + '/data/posts.json');
});

app.get('/posts/:postId', function (req, res) {
	var response = 'post id: ' + req.params.postId;
	// read file
	fs.readFile(__dirname + '/data/posts.json', function (error, file) {
		var parsedFile = JSON.parse(file);
	// pick post with timestam = postId
	response = parsedFile[req.params.postId];
	// send content back
 var date = new Date(parseInt(req.params.postId));
 //without parcedInt- date var = string instead of integer and the toLocaleDateString() won't work  
     date = date.toLocaleDateString();
   // res.send(response); --> if this line exists-> the line below won't execute as the data will be only sent once 
   res.render('post', { post: parsedFile[req.params.postId] , date: date});
});
});
//express deprecated res.send(status, body): Use res.status(status).send(body) instead server.js:51:9


app.listen(3000, function(){
	console.log("server is listening at port 3000");
}); 





// app.get('/my-lovely-endpoint', function (req, res) {
//     res.send('Hello there!');
// });