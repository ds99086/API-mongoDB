const addButton = document.querySelector(".addButton");
const container = document.querySelector(".card-display");
const searchBox = document.getElementById("new-movie-name");
const searchList = document.getElementById("search-dropdown");

let baseURL = "https://api.themoviedb.org/3/";
const apiKEY = "1b0424a520ba27ca4b58ed57e7db8ebf";

class item {
  constructor(itemName) {
    this.createDiv(itemName);
  }

  //TO DO modify to show director and year published. possbily the photos of the movie.
  createDiv(itemName) {
    let movieBox = document.createElement("div");
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
				<div class="movie-id invisible">${itemName.movieID}</div>
			</div>
			<div class=" place-self-center pt-10">
			<button class="removeButton  py-3 px-6    mb-4  text-base   font-semibold  focus:outline-none transition-colors duration-200 rounded-full block  bg-transparent hover:bg-red-700  border-red-700 border-2 text-red-700 hover:text-red-200">remove from my list</button>
		</div>
		</div>
	</div>
	`;
    movieBox.classList.add("moviebox", "p-5");

    container.appendChild(movieBox);
  }
}

async function load() {
  const records = await fetch("/load").then((res) => res.json());
  //console.log(records);
  records.forEach((record) => {
    //console.log(record);
    new item(record);
  });
}

load();


async function remove(name, director, year, image) {

	const payload = {
		title: name,
		director: director,
		year: year,
		img: image
	};

	const response = await fetch('/remove', {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
	//console.log(response.status);

	if(response.status == 200) {
		alert("Movie deleted from my list");
		return 1;
	} else if (response.status == 409) {
		alert("Movie does not exist");
		return null;
	} else {
		alert("Error occured while deleting movie");
		return null;
	}
}


container.addEventListener('click', async e => {

	if (e.target && e.target.matches(".removeButton")) {
		const movieContainer = e.target.parentElement.parentElement.parentElement;

		//console.log(movieContainer);
		const movieDirector = movieContainer.querySelector(".movie-director").innerHTML;
		const movieTitle = movieContainer.querySelector(".movie-title").innerHTML;
		const movieYear = movieContainer.querySelector(".movie-year").innerHTML;
		const imgFullURL = movieContainer.querySelector(".movie-image").src;
		const movieImg = imgFullURL.substring(31);

		const response = await remove(movieTitle, movieDirector, movieYear, movieImg);
		//console.log(response);
		if (response == 1) {
			movieContainer.parentElement.remove();
		}

	}
})