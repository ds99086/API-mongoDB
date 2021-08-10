const addButton = document.querySelector('.addButton');
const container = document.querySelector('.card-display');
const searchBox = document.getElementById('new-movie-name');
const searchList = document.getElementById("search-dropdown");

//put const APIKEY inside key.js
let baseURL = 'https://api.themoviedb.org/3/';
let configData = null;
let baseImageURL = null;
const apiKEY = "1b0424a520ba27ca4b58ed57e7db8ebf";

class item {
	constructor(itemName) {
		this.createDiv(itemName)
	}

	createDiv(itemName) {
		let movieBox = document.createElement('div');
		movieBox.innerHTML = `
		
        <div class="relative w-4/5 my-5 shadow-lg group container rounded-md bg-white max-w-max  flex  content-div">
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
		`
		movieBox.classList.add('moviebox');
		container.appendChild(movieBox)
	}
}

async function load() {

	const loadURL = `https://api.themoviedb.org/3/discover/movie?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
	fetch(loadURL).then(res => res.json()).then(data => {
		showMovies(data.results);
	})
}

//TO DO no director yet.
async function getDirector(id) {
	const searchURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US`

	await fetch(searchURL).then(res => res.json()).then(data => {
		let directorName = "Director can't be found";
		data.crew.forEach(person => {
			if (person.job == "Director") {
				directorName = person.original_name;
				//console.log(directorName);
			}
		});
		return directorName;
	})
}

//edit card layout
async function showMovies(results) {
	container.innerHTML = ``
	results.forEach(movie => {



		const searchURL = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US`
		let directorName = "Director can't be found";

		fetch(searchURL).then(res => res.json()).then(data => {
			data.crew.forEach(person => {
				if (person.job == "Director") {
					directorName = person.original_name;
				}
			});
			
			let movieImg = "";

			if (movie.poster_path == null || movie.poster_path== "" || movie.poster_path == "null") {
				console.log("null image found")
				movieImg = "/img/poster_not_found.jpg";
			} else {
				movieImg  = "https://image.tmdb.org/t/p/w342" + movie.poster_path
				//console.log(movieImg);
			}

			let payload = {
				title: movie.original_title,
				director: directorName,
				year: movie.release_date,
				img: movieImg,
				movieID: movie.id
			} 

			//console.log(payload)
			new item(payload);
		})
	})
}


async function showOptions() {

	const keyword = searchBox.value;
	if (keyword == "") {
		load();
	} else {
		//console.log("the word being searched is " + keyword)

		const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US&query=${keyword}&page=1&include_adult=false`

		fetch(searchURL).then(res => res.json()).then(data => {
			console.log(data.results); //checked
			showMovies(data.results)
		})
	}
}

async function add(name, director, year, image, movieID) {

	let movieKeywords = []
	const getKeyword = `https://api.themoviedb.org/3/movie/${movieID}/keywords?api_key=1b0424a520ba27ca4b58ed57e7db8ebf`
	fetch(getKeyword).then(res => res.json()).then(data => {
			//console.log(data.keywords)
		data.keywords.forEach(keyword => {
		movieKeywords.push(keyword.name);
		})
			
			//console.log(movieKeywords)
	})

	const payload = {
		title: name,
		director: director,
		year: year,
		img: image,
		movieID: movieID,
		keywords: movieKeywords
	};

	console.log(payload)

	const response = await fetch('/add', {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
	//console.log(response.status);

	if(response.status == 200) {
		alert("Movie added to my list");
	} else if (response.status == 409) {
		alert("Movie already exists");
	} else {
		alert("Error occured while adding movie");
	}
}

load();

container.addEventListener('click', async e => {

	if (e.target && e.target.matches(".addButton")) {
		const movieContainer = e.target.parentElement.parentElement.parentElement;

		//console.log(movieContainer);
		const movieDirector = movieContainer.querySelector(".movie-director").innerHTML;
		const movieTitle = movieContainer.querySelector(".movie-title").innerHTML;
		const movieYear = movieContainer.querySelector(".movie-year").innerHTML;
		const imgFullURL = movieContainer.querySelector(".movie-image").src;
		const movieImg = imgFullURL.substring(31);
		const movieID = movieContainer.querySelector(".movie-id").innerHTML;
		//console.log(imgFullURL);
		//console.log(imgFullURL.substring(32));
		//console.log(imgFullURL.substring(31));

		add(movieTitle, movieDirector, movieYear, movieImg, movieID);
	}
})
searchBox.addEventListener('input', showOptions)

