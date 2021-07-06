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


load();