const analysisContainer = document.querySelector(".movie-analysis-container");

let sortableKeywordList = [];
let sortableGenreList = [];
let xLabelsKeywords = [];
let yCountsKeywords = [];
let xLabelsGenre = [];
let yCountsGenre = [];
const ctx1 = document.getElementById("myChart1").getContext("2d");
const ctx2 = document.getElementById("myChart2").getContext("2d");


async function load() {
  const records = await fetch("/load").then((res) => res.json());

  records.forEach((movies) => {
    movies.keywords.forEach((word) => {
      if (containsObject(word, sortableKeywordList) == false) {
        sortableKeywordList.push({
          word: word.name,
          count: 1,
        });
      } else if (containsObject(word, sortableKeywordList) == true) {
        const i = sortableKeywordList.findIndex(
          (item) => item.word === word.name
        );
        sortableKeywordList[i].count = sortableKeywordList[i].count + 1;
      }
    });

    movies.genre.forEach((word) => {
      if (containsObject(word, sortableGenreList) == false) {
        sortableGenreList.push({
          word: word.name,
          count: 1,
        });
      } else if (containsObject(word, sortableGenreList) == true) {
        const i = sortableGenreList.findIndex(
          (item) => item.word === word.name
        );
        sortableGenreList[i].count = sortableGenreList[i].count + 1;
      }
    });
  });

  sortableKeywordList.sort(compare);
  sortableGenreList.sort(compare);

  for (let i = 0; i < sortableKeywordList.length; i++) {
    xLabelsKeywords.push(sortableKeywordList[i].word);
    yCountsKeywords.push(sortableKeywordList[i].count);
  }

  for (let i = 0; i < sortableGenreList.length; i++) {
    xLabelsGenre.push(sortableGenreList[i].word);
    yCountsGenre.push(sortableGenreList[i].count);
  }

  console.log(sortableKeywordList);
  console.log(sortableGenreList);

  createChart("bar", "Keyword stats", yCountsKeywords, xLabelsKeywords, ctx1);
  createChart('doughnut', "Genre stats", yCountsGenre, xLabelsGenre, ctx2);
}

function containsObject(obj, list) {
  let i;
  for (i = 0; i < list.length; i++) {
    if (list[i].word === obj.name) {
      return true;
    }
  }
  return false;
}

function compare(a, b) {
  if (a.count < b.count) {
    return 1;
  } else if (a.count > b.count) {
    return -1;
  }
  return 0;
}
const ctx = document.getElementById("myChart1").getContext("2d");
function createChart(type, label, ycounts, xlabels, ctx) {
  //const ctx = document.getElementById("myChart1").getContext("2d");

  const myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: xlabels,
      datasets: [
        {
          label: label,
          data: ycounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

async function getGenre(movieGenreList) {
  fetch(`/getGenre/${movieID}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.genre);
      data.genre.forEach((word) => {
        movieGenreList.push(word);
      });
      console.log(movieGenreList);
    });
}

load();
