const analysisContainer = document.querySelector('.movie-analysis-container');

let temporaryList = {};
let sortableList = [];


async function load()  {
    const records = await fetch("/load")
.then((res) => res.json());

records.forEach(movies => {
    console.log(movies);
    movies.keywords.forEach(items => {

        if (!(items.name in temporaryList )){
            temporaryList[items.name] = 1;
        } else if (items.name in temporaryList) {
            temporaryList[items.name] = temporaryList[items.name] + 1;
        }
        
    })
    console.log(temporaryList);
});

temporaryList.sort(compare);

function  compare (a, b) {
    let countA = counts[a];
    let countB = counts[b];
    return countA-countB;
}
console.log(temporaryList);
}


function countWordFreq(wordList) {
    
}


load();