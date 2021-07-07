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
		
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
            <div class="w-full">
                <img class="movie-image" src="https://image.tmdb.org/t/p/w185${itemName.img}">
            </div>
			<div class="px-6 py-4">
				<div class="flex items-center justify-between sm:mt-2">
					<div class="font-bold text-xl mb-2">
						<h3 class="movie-title">${itemName.title}</h3>
					</div>
					<div class=" text-gray-700 text-base">
						<p class="movie-director">${itemName.director}</p>
					</div>
					<div>
						<p class="movie-year">${itemName.year}</p>
					</div>	
				</div>
				<div>
					<button class="addButton">+ Add to my list</button>
				</div>
			</div>
        </div>
    </div>
		`
		movieBox.classList.add('moviebox', 'p-5');
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
				console.log(directorName);
				//console.log(typeof directorName);
				//return directorName;
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
					//console.log(directorName);
				}
			});

			let payload = {
				title: movie.original_title,
				director: directorName,
				year: movie.release_date,
				img: movie.poster_path
			}
			new item(payload);
		})
	})
}


async function showOptions() {

	const keyword = searchBox.value;
	if (keyword == "") {
		load();
	} else {
		console.log("the word being searched is " + keyword)

		const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US&query=${keyword}&page=1&include_adult=false`

		fetch(searchURL).then(res => res.json()).then(data => {
			//console.log(data.results); //checked
			showMovies(data.results)
		})
	}
}

async function add(name, director, year, image) {

	const payload = {
		title: name,
		director: director,
		year: year,
		img: image
	};

	const response = await fetch('/add', {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
	console.log(response);
}

load();

container.addEventListener('click', async e => {

	//console.log("in the listener");

	if (e.target && e.target.matches(".addButton")) {
		const movieContainer = e.target.parentElement.parentElement.parentElement;

		console.log(movieContainer);
		const movieDirector = movieContainer.querySelector(".movie-director").innerHTML;
		const movieTitle = movieContainer.querySelector(".movie-title").innerHTML;
		const movieYear = movieContainer.querySelector(".movie-year").innerHTML;
		const imgFullURL = movieContainer.querySelector(".movie-image").src;
		const movieImg = imgFullURL.substring(31);
		console.log(imgFullURL);
		console.log(imgFullURL.substring(32));
		console.log(imgFullURL.substring(31));

		add(movieTitle, movieDirector, movieYear, movieImg);
	}
})
searchBox.addEventListener('input', showOptions)

