const express = require('express');
const path = require('path');
const fs = require('fs');
//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Movie = require('./models/movies');
const app = express();

//connect to MongoDB
const dbURI = 'mongodb+srv://trial:pwd123@cluster0.vfjk3.mongodb.net/movieDB?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));
// app.set('view engine', 'html');

app.get('/', function (req, res) {


  res.render('index');
});


app.post('/update-list', async function (req, res) {

  async function toFind(item) {
    const response = await Movie.find(item);
    console.log('Response => ', response);
    return response;
  }

  let userObj = req.body;
  console.log("userobj is " + userObj);

  const { oldname, oldemail, name, email } = req.body;
  console.log(oldname);
  console.log(name);

  const resp = await Movie.updateOne(
    {
      name: oldname
    },
    {
      $set: {
        name: name
      }
    })
  console.log(resp);

  const result = await toFind(userObj);
  res.send(result);
});

app.post('/add', async function (req, res) {
  const newMovie = req.body;
  //console.log(newMovie);

  const checkDup = await Movie.exists(newMovie) 
  console.log(checkDup)
  if (checkDup == true) { 
    console.log("sending status 409")
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

app.get('/load', async function (req, res) {
  const response = await Movie.find({});
  console.log(response);
  res.send(response);
})


app.listen(3000, function () {
  console.log("app listening on port 3000!");
});


// app.get('/users', (req, res) => {
//   //youngest listed first
//   User.find().sort({ createdAt: -1 })
//     .then((result) => {
//       res.render('index', { title: 'All Users', users: result })
//     }).catch((err) => {
//       console.log(err);
//     })
// })



// app.get('/get-profile', function (req, res) {

//   let myquery = { userid: 1 };

//   db.collection("movies").findOne(myquery, function (err, result) {
//     if (err) throw err;
//     response = result;
//     client.close();

//     // Send response
//     res.send(response ? response : {});
//   });
// });


