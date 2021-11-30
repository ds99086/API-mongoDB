const addButton = document.querySelector(".addButton");
const container = document.querySelector(".card-display");
const searchBox = document.getElementById("new-movie-name");
const searchList = document.getElementById("search-dropdown");

//put const APIKEY inside key.js
let baseURL = "https://api.themoviedb.org/3/";
let configData = null;
let baseImageURL = null;

class item {
  constructor(itemName) {
    this.createDiv(itemName);
  }

  createDiv(itemName) {
    let movieBox = document.createElement("div");
    console.log(itemName.movieID);
    movieBox.innerHTML = `
        <div id="movie-container" class="relative w-4/5 my-5 shadow-lg group container rounded-md bg-white max-w-max  flex  content-div">
            <div>
                <img class="movie-image object-scale-down" src="${itemName.img}">
            </div>
			<div class="absolute opacity-0 p-3 w-full h-full bg-gray-700 bg-opacity-70 hover:opacity-100 ease-in duration-200 flex flex-col justify-center" >
				<div class="flex items-center flex-col justify-between  ">
					<div class="font-bold text-xl m-2 ">
						<h3 class="text-white movie-title">${itemName.title}</h3>
					</div>
					<div class=" text-gray-200 text-base m-2">
						<p class="movie-director">${itemName.director}</p>
					</div>
					<div>
						<p class="movie-year text-gray-100">${itemName.year}</p>
					</div>	
					<div class="movie-id invisible">${itemName.movieID}</div>
					
				</div>
				<div class=" place-self-center pt-10">
					<button class="addButton  p-0 w-8 h-8    mb-4  text-base   font-semibold  focus:outline-none transition-colors duration-200 rounded-full block  bg-transparent hover:bg-red-700  border-red-700 border-2 text-red-700 hover:text-red-200">+</button>
				</div>
			</div>
        </div>
		`;
    movieBox.classList.add("moviebox");
    container.appendChild(movieBox);
  }
}

async function load() {
  await fetch("/loadAPIMovies")
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
    });
}

async function getDirector(id) {
  let directorName = "Director can't be found";
  const data = await fetch(`/getCastData/${id}`).then((res) => res.json());

  data.crew.forEach((person) => {
    if (person.job == "Director") {
      directorName = person.original_name;
    }
  });
  return directorName;
}

//edit card layout
async function showMovies(results) {
  container.innerHTML = ``;
  await results.forEach(async (movie) => {
    //console.log(movie);
    const director = await getDirector(movie.id);
    let movieImg = "";
    if (
      movie.poster_path == null ||
      movie.poster_path == "" ||
      movie.poster_path == "null"
    ) {
      //console.log("null image found")
      movieImg = "/img/poster_not_found.jpg";
    } else {
      movieImg = "https://image.tmdb.org/t/p/w342" + movie.poster_path;
    }

    let payload = {
      title: movie.original_title,
      director: director,
      year: movie.release_date,
      img: movieImg,
      movieID: movie.id,
    };

    new item(payload);
  });
}

async function showOptions() {
  const keyword = searchBox.value;
  if (keyword == "") {
    load();
  } else {
    //console.log("the word being searched is " + keyword)

    fetch(`/search/${keyword}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.results); //checked
        showMovies(data.results);
      });
  }
}

async function add(name, director, year, image, movieID, movieKeywords, genre) {
  console.log(movieKeywords);
  let payload = {
    title: name,
    director: director,
    year: year,
    img: image,
    movieID: movieID,
    keywords: movieKeywords,
    genre: genre,
  };

  console.log("payload to be added " + payload);
  console.log(payload);
  console.log(payload.genre);

  const response = await fetch("/add", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  //console.log(response.status);

  if (response.status == 200) {
    alert("Movie added to my list");
  } else if (response.status == 409) {
    alert("Movie already exists");
  } else {
    alert("Error occured while adding movie");
  }
}

load();

container.addEventListener("click", async (e) => {
  if (e.target && e.target.matches(".addButton")) {
    const movieContainer = e.target.parentElement.parentElement.parentElement;

    //console.log(movieContainer);
    const movieDirector =
      movieContainer.querySelector(".movie-director").innerHTML;
    const movieTitle = movieContainer.querySelector(".movie-title").innerHTML;
    const movieYear = movieContainer.querySelector(".movie-year").innerHTML;
    const imgFullURL = movieContainer.querySelector(".movie-image").src;
    const movieImg = imgFullURL.substring(31);
    const movieID = movieContainer.querySelector(".movie-id").innerHTML;
    //const genre = movieContainer.querySelector(".genre").innerHTML;
    //console.log(imgFullURL);
    //console.log(imgFullURL.substring(32));
    //console.log(imgFullURL.substring(31));

    let movieKeywords = [];
    let genreList = [];

    await fetch(`/getGenre/${movieID}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (data.success != false) {
          data.genres.forEach((words) => {
            genreList.push(words);
          });
        }
      });

    await fetch(`/getKeywords/${movieID}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (data.success != false) {
          data.keywords.forEach((keyword) => {
            movieKeywords.push(keyword);
          });
        }
      });
	console.log("checking package");
    console.log(genreList);
    console.log(movieKeywords);
    add(
      movieTitle,
      movieDirector,
      movieYear,
      movieImg,
      movieID,
      movieKeywords,
      genreList
    );
  }
});
searchBox.addEventListener("input", showOptions);
