const addButton = document.querySelector('.addButton')
const container = document.querySelector('.card-display')

class item {
	constructor(itemName) {
		this.createDiv(itemName)
	}

	//TO DO modify to show director and year published. possbily the photos of the movie.
	createDiv(itemName) {


		// let input = document.createElement('div')
		// input.innerHTML = itemName.title

		let movieBox = document.createElement('div');
		movieBox.innerHTML = `
		
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
            <div class="w-full">
                <img src="img\\test.png">
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


		// let director = document.createElement('div')
		// director.innerHTML = itemName.director
		// director.classList.add('director')

		// let year = document.createElement('div')
		// year.innerHTML = itemName.year
		// year.classList.add('year')

		container.appendChild(movieBox)


	}}

async function load() {
    const records = await fetch('/load').then((res) => res.json())

	//console.log(records);

	records.forEach(record => {
		//console.log(record);
		new item(record);
	});
    // records.forEach(({record}) => {
	// 	console.log(record);
    //     new item(record);
    // })
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

	//TO DO just add another item in the container. 
	container.innerHTML = ``;
	load();
}

load();

addButton.addEventListener('click', add)