const addButton = document.querySelector('.addButton');
const container = document.querySelector('.card-display');
const searchBox = document.getElementById('new-movie-name');
const searchList = document.getElementById("search-dropdown");

let baseURL = 'https://api.themoviedb.org/3/';
const apiKEY = "1b0424a520ba27ca4b58ed57e7db8ebf";

class item {
	constructor(itemName) {
		this.createDiv(itemName)
	}

	//TO DO modify to show director and year published. possbily the photos of the movie.
	createDiv(itemName) {

		let movieBox = document.createElement('div');
		movieBox.innerHTML = `
			
	<div class="relative w-4/5 shadow-lg group container m-auto rounded-md bg-white max-w-max  flex justify-center items-center  content-div">
	<div>
		<img class="movie-image object-scale-down" src="https://image.tmdb.org/t/p/w342${itemName.img}">
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
		</div>
	</div>
</div>


		`
		movieBox.classList.add('moviebox', 'p-5');

		container.appendChild(movieBox)

	}
}

async function load() {
	const records = await fetch('/load').then((res) => res.json())
	//console.log(records);
	records.forEach(record => {
		//console.log(record);
		new item(record);
	});

}


load();