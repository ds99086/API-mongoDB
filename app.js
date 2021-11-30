const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Movie = require('./models/movies');
const app = express();

const fetch = require('node-fetch');

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

app.get('/loadAPIMovies', async function (req, res) {
  console.log("i am in  the server");
  const loadURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  const data = await fetch(loadURL).then(res => res.json())
  //console.log(data);
  res.json(data);

})

app.get('/getCastData/:id', async function (req, res) {
  //console.log("i am  in the server2");
  const id = req.params.id;
  //console.log(id);
  const loadURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
  const data = await fetch(loadURL).then(res => res.json())
  res.json(data);
  })
  
  app.get('/search/:keyword', async function (req, res) {
    const keyword = req.params.keyword;
    const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
    const data = await fetch(searchURL).then(res => res.json())
  res.json(data);
  })

  app.get('/getKeywords/:movieID', async function (req, res) {
    const movieID = req.params.movieID;
  
  const getKeyword = `https://api.themoviedb.org/3/movie/${movieID}/keywords?api_key=1b0424a520ba27ca4b58ed57e7db8ebf`
  try {
    const data = await fetch(getKeyword).then(res => res.json())
    res.json(data);
  } catch {
    res.status(401).send("This movie has no keywords yet");
  }
  
})

app.get('/getGenre/:movieID', async function (req, res) {
  const movieID = req.params.movieID;
const genreData = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}&language=en-US`
const data = await fetch(genreData).then(res => res.json())
res.json(data);
})

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});


