const analysisContainer = document.querySelector('.movie-analysis-container');

let sortableList = [];

async function load()  {
    const records = await fetch("/load")
.then((res) => res.json());

records.forEach(movies => {
    movies.keywords.forEach(word => {

        if (containsObject(word, sortableList) == false){
            sortableList.push({
                word: word.name, 
                count: 1
            });
            xlabels.push(word.name);
            ycounts.push(1);
        } else if (containsObject(word, sortableList) == true) {
            const i = sortableList.findIndex((item)=> item.word === word.name);
            sortableList[i].count = sortableList[i].count + 1;
            ycounts[i] = ycounts[i] +1;
        }
    })
});

sortableList.sort(compare);


console.log(sortableList);

createChart();

}

let  xlabels = [];
let ycounts = [];
load();

function containsObject(obj, list) {
    let i;
    for(i = 0; i< list.length; i++) {
        if (list[i].word === obj.name) {
            return true;
        }
    }
    return false;
}

function  compare (a, b) {
    if (a.count < b.count) {
        return 1;
    } else if (a.count  > b.count) {
        return -1;
    }
    return 0;
}


function createChart() {
const ctx = document.getElementById("myChart").getContext("2d");

const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: xlabels,
    datasets: [
      {
        label: "Movie keyword preferences",
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
