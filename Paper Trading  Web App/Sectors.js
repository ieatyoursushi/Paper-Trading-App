import { priceDirection } from '/ColorChanger.js';
import { format } from '/movers.js';
const api = "https://financialmodelingprep.com/api/v3/sector-performance?apikey=69f8cb94503175678fe3194af1c9e734";
let sectors = [];
const Sectors = document.querySelector(".Sectors")
let elementsCreated = false;
let dataRetrieved = false;
let percentageChanges = []

function getSectors() {
    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            sectors.push(data);
            displaySectors(data);
            console.log(data);
        }) 
    console.log(percentageChanges);
}
function displaySectors(data) {
    if (!elementsCreated) {
        createElements(data);
    }
    if (percentageChanges.length > 0) {
        percentageChanges = [];
    }
    let elements = document.querySelectorAll(".sector");
    for (let i = 0; i < data.length; i++) {
        elements[i].children[0].innerHTML = data[i]["sector"];
        let percentage = Math.floor(data[i]["changesPercentage"].replace('%', '') * 100) / 100;
        elements[i].children[1].innerHTML = format(percentage, true) + '%';
        //checks four conditions assigning a color depending on which condition is true
        percentageChanges.push(elements[i].children[1].innerHTML.replace('+', '').replace('%', ''))

        let displayedColor = priceDirection(percentageChanges[i]);
        elements[i].style.borderColor = displayedColor; //dark green
        elements[i].children[1].style.color = displayedColor;
    }
    //console.log(data[0]);
    dataRetrieved = true;
}
function createElements(data) {
    data.forEach(function (sector) {
        let sectorCard = document.createElement("div")
        sectorCard.classList.add("sector");
        let sectorTitle = document.createElement("h5")
        sectorCard.append(sectorTitle);
        let sectorPerformance = document.createElement("h4")
        sectorCard.append(sectorPerformance);
        Sectors.append(sectorCard);
    })
    elementsCreated = true;
}
window.setTimeout(getSectors, 500);
window.setInterval(getSectors, 600000);



