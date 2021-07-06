const addButton = document.querySelector('.addButton');
const container = document.querySelector('.card-display');
const searchBox = document.getElementById('new-movie-name');
const searchList = document.getElementById("search-dropdown");

//const APIKEY is inside key.js
let baseURL = 'https://api.themoviedb.org/3/';
let configData = null;
let baseImageURL = null;
const apiKEY = "1b0424a520ba27ca4b58ed57e7db8ebf";

class item {
	constructor(itemName) {
		this.createDiv(itemName)
	}

	//TO DO modify to show director and year published. possbily the photos of the movie.
	createDiv(itemName) {

		// fetch('https://api.themoviedb.org/3/search/movie?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US&page=1&include_adult=false').then(res => res.json()).then(data => {
		// 	console.log(data);
		// })

		

		let movieBox = document.createElement('div');
		movieBox.innerHTML = `
		
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
            <div class="w-full">
                <img src="${itemName.img}">
            </div>
			<div class="px-6 py-4">
				<div class="flex items-center justify-between sm:mt-2">
					<div class="font-bold text-xl mb-2">
						<h3>${itemName.title}</h3>
					</div>
					<div class="text-gray-700 text-base">
						<p>${itemName.director}</p>
					</div>
					<div>
						<p>${itemName.year}</p>
					</div>
				</div>
			</div>
        </div>
    </div>
		`
		movieBox.classList.add('moviebox', 'p-5');

		container.appendChild(movieBox)

	}}

async function load() {
    const records = await fetch('/load').then((res) => res.json())
	//console.log(records);
	records.forEach(record => {
		//console.log(record);
		new item(record);
	});

}

async function add() {

	const moviename = document.getElementById('new-movie-name').value

	const moviedirector = document.getElementById('new-movie-director').value
	const movieyear = document.getElementById('new-movie-year').value
	
	const payload = {
		title: moviename,
		director: moviedirector,
		year: movieyear
	};

	console.log(payload);

	const response = await fetch ('/add', {
		method: "POST",
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
	console.log(response);

	//TO DO just add another item in the container if response status has no error. 
	container.innerHTML = ``;
	load();
}

//no director yet.
function getDirector(id) {
	const searchURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US`
	
	fetch(searchURL).then(res => res.json()).then(data => {
		data.crew.forEach(element => {
			//console.log(element); //checked

			return "no director yet";
		});
	})
}

function showMovies(results) {

	results.forEach(movie => {

		//console.log(movie.id); //checked
		console.log(movie.poster_path);

	const directorname = getDirector(movie.id);
	const moviename = movie.original_title

		const option = document.createElement("option");
		option.value = movie.original_title
		option.innerHTML = `


			<div class="">
            <div class="min-w-full">
                <img src="http://image.tmdb.org/t/p/w185${movie.poster_path}">
            </div>

					<div class="">
						<p>${directorname}</p>
					</div>
					<div>
						<p>${movie.release_date}</p>
					</div>

			</div>

		`

		searchList.appendChild(option);

	})
}


function showOptions() {

	searchList.innerHTML = ``

	const keyword = searchBox.value;
	console.log("the word being searched is " + keyword)

	const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=1b0424a520ba27ca4b58ed57e7db8ebf&language=en-US&query=${keyword}&page=1&include_adult=false`
	
	fetch(searchURL).then(res => res.json()).then(data => {

		//console.log(data.results); //checked
		showMovies(data.results)
	})
}


load();
addButton.addEventListener('click', add)
window.addEventListener('load', function () {

	searchBox.addEventListener('input', showOptions)
})
