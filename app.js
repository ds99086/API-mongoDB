const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Movie = require('./models/movies');
const app = express();

const API_KEY = "1b0424a520ba27ca4b58ed57e7db8ebf";

//connect to MongoDB
const dbURI = 'mongodb+srv://admin:Admin123@cluster0.w82k2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
  res.render('index');
});


// app.post('/update-list', async function (req, res) {

//   async function toFind(item) {
//     const response = await Movie.find(item);
//     console.log('Response => ', response);
//     return response;
//   }

//   let userObj = req.body;

//   const { oldname, oldemail, name, email } = req.body;

//   const resp = await Movie.updateOne(
//     {
//       name: oldname
//     },
//     {
//       $set: {
//         name: name
//       }
//     })

//   const result = await toFind(userObj);
//   res.send(result);
// });

app.post('/add', async function (req, res) {
  const newMovie = req.body;
  console.log(newMovie);

  const checkDup = await Movie.exists({movieID: newMovie.movieID}) 
  console.log("checking duplication result: "+ checkDup);
  if (checkDup == true) { 
    //console.log("sending status 409");
    res.sendStatus(409);
  } else if (checkDup == false) { 
    try {
      await Movie.create(newMovie);
      res.sendStatus(200);
    } catch {
      res.sendStatus(500)
    }
  }
})

app.post('/remove', async function (req, res) {
  const removeMovie = req.body;
  //console.log(newMovie);

  const checkDup = await Movie.exists(removeMovie) 
  //console.log(checkDup);
  if (checkDup == false) { 
    //console.log("sending status 409");
    res.sendStatus(409);
  } else if (checkDup == true) { 
    try {
      await Movie.deleteOne(removeMovie);
      res.sendStatus(200);
    } catch {
      res.sendStatus(500)
    }
  }
})

app.get('/load', async function (req, res) {
  const response = await Movie.find({});
  //console.log(response);
  res.send(response);
})


app.listen(3000, function () {
  console.log("app listening on port 3000!");
});


