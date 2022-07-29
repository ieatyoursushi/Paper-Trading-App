import { priceDirection } from '/ColorChanger.js';
import { format } from '/movers.js';
import { Stock } from '/api.js';
import { cleanMessage } from '/api.js';
function changeClass(that, className, action) {
    var classFunction = "document.querySelector('" + that + "')" + ".classList." + action + "('" + className + "')";
    console.log(classFunction);
    eval(classFunction);
}
let searchHistory = [];
let intervalHistory = []
let chartArea = {
    fill: 'start',
    backgroundColor: 'rgb(20, 205, 50, 0.5)',
}
let query = false;
//let eventHistory = document.getEventListeners(document.getElementById("searchbar"))

let infoDiv = document.querySelector(".stockInfo").children;
for (let i = 0; i < infoDiv.length; i++) {
    infoDiv[i].children[0].style.marginRight = "20px";
    infoDiv[i].children[1].style.margin = "5px 0";
}
document.getElementById("")
document.getElementById("searchbar").addEventListener('change', (searchBar) => {
    let quote = document.querySelector("#searchbar").value.toUpperCase();

    console.log(searchHistory);
 
    let listener = document.getElementById("searchbar").addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            fetch("https://financialmodelingprep.com/api/v3/quote/" + quote + "?apikey=69f8cb94503175678fe3194af1c9e734")
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    let tradeModal = document.getElementById("tradeModal");
                    if (!tradeModal.classList.contains("moveUpp")) {
                        changeClass("#tradeModal", "moveUpp", 'add')
                    }
                    // trade modal tab
                    let quoteTitle = document.querySelector(".quoteTitle");
                    let stockLabels = document.querySelectorAll(".stockLabel");
                    for (let i = 0; i < stockLabels.length; i++) {
                        let isNumber = stockLabels[i].getAttribute("data-isNumber");
                        let dataValue = stockLabels[i].getAttribute("data-value");
                        let bigNumber = stockLabels[i].getAttribute("data-bigNumber");
                        if (isNumber == "true") {
                            stockLabels[i].children[1].innerHTML = format(eval("data[0]." + dataValue), false)
                        } else {
                            if (bigNumber == "true") {
                                //convert big integer to notation (1-999K, 1-999M, 1-999B, 1-999T)
                                let num = eval("data[0]." + dataValue);
                                //default value is 0;
                                let number = 0;
                                //checks if [i] number is null, if it is null then use a string placeholder 
                                if (num != null) {
                                    number = num.toString();
                                } else {
                                    number = 0;
                                    number = number.toString();
                                }

                                console.log(number);
                                let numberArray = number.split("");
                                let numberLength = numberArray.length;
                                console.log(numberArray.length);
                                if (numberLength > 6 && numberLength <= 9) {
                                    stockLabels[i].children[1].innerHTML = format(Math.ceil((number / 1000000) * 100) / 100, false) + "M";
                                } else if (numberLength > 9 && numberLength <= 12) {
                                    stockLabels[i].children[1].innerHTML = format(Math.ceil((number / 1000000000) * 100) / 100, false) + "B";
                                } else if (numberLength > 12 && numberLength <= 15) {
                                    stockLabels[i].children[1].innerHTML = format(Math.ceil((number / 1000000000000) * 100) / 100, false) + "T";
                                } else {
                                    stockLabels[i].children[1].innerHTML = number;
                                }
                            } else {
                                stockLabels[i].children[1].innerHTML = eval("data[0]." + dataValue);
                            }
                        }
 
                    }
                    quoteTitle.children[0].innerHTML = "<h3>" + data[0].symbol + "</h3>";
                    quoteTitle.children[1].innerHTML = data[0].name;
                    //side bar
                    let sidebar = document.querySelector(".combine");

                    //change confusing naming.
                    let stockInfo = sidebar.children[0].children[0];
                    let infoCards = document.querySelectorAll(".infoCard")
                    for (let i = 0; i < infoCards.length; i++) {
                        let dataValue = infoCards[i].getAttribute("data-value");
                        let isNumber = infoCards[i].getAttribute("data-isNumber");
                        //ignores objects with a value of cancel
                        if (dataValue != "cancel") {
                            console.log(isNumber == "true")
                            if (isNumber == "true") {
                                infoCards[i].children[1].innerHTML = format(eval("data[0]." + dataValue), false)
                            } else {
                                infoCards[i].children[1].innerHTML = eval("data[0]." + dataValue);
                            }
                            if (infoCards[i].getAttribute("data-isLarge") == "true") {
                                infoCards[i].children[1].innerHTML = Number(eval("data[0]." + dataValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                        }  
                        if (dataValue === "pe") {
                            infoCards[i].children[1].innerHTML = format(eval("data[0]." + dataValue), false) + "x"

                        }

                    }
                    //objects that have the value cancel are done manually
                    stockInfo.children[3].children[1].innerHTML = format(data[0].dayLow, false) + " - " + format(data[0].dayHigh, false);
                    stockInfo.children[4].children[1].innerHTML = format(data[0].yearLow, false) + " - " + format(data[0].yearHigh, false);
                    fetch("https://financialmodelingprep.com/api/v4/company-outlook?symbol=" + quote + "&apikey=69f8cb94503175678fe3194af1c9e734")
                        .then((response) => {
                            return response.json();
                        }).then((data) => {
                            let screeners = document.getElementsByClassName("screener");
                            screeners[0].children[1].innerHTML = "$" + format(data.ratios[0].dividendPerShareTTM, false) + "/" + format(data.ratios[0].dividendYielPercentageTTM, false) + "%";
                            screeners[5].children[1].children[0].innerHTML = data.profile.website;
                            screeners[5].children[1].setAttribute("href", data.profile.website);
                            for (let i = 0; i < screeners.length; i++) {
                                let _dataValue = screeners[i].getAttribute("data-value");
                                let _dataLarge = screeners[i].getAttribute("data-isLarge");
                                console.log(screeners[i])
                                if (_dataValue != "cancel") {
                                    screeners[i].children[1].innerHTML = eval("data." + _dataValue);
                                    if (_dataLarge == "true") {
                                        screeners[i].children[1].innerHTML = Number(eval("data." + _dataValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    }
                                }
                            }
                            console.log(quoteTitle.children[0]);
 
                            //price target section
                            let priceTargetDiv = document.querySelector(".priceTarget");
                            priceTargetDiv.children[1].innerHTML = data.rating[0].ratingScore + " (" + data.rating[0].ratingRecommendation + ")";

                        })
 

                    //style
                    let quotePrice = document.querySelector(".quotePrice");
                    let priceColor = priceDirection(format(data[0].changesPercentage, true));
                    quotePrice.children[0].innerHTML = "$" + Number(data[0].price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + "<span class='priceChangeSpan'>" + format(data[0].change, true) + "</span>" + "<span class='pricePercentageSpan'>" + " " + "(" + format(data[0].changesPercentage, false) + "%" + ")" + "</span>";
                    document.getElementsByClassName("priceChangeSpan")[0].style.color = priceDirection(format(data[0].changesPercentage, true));
                    document.getElementsByClassName("priceChangeSpan")[0].style.fontSize = "21px";
                    document.getElementsByClassName("pricePercentageSpan")[0].style.color = priceDirection(format(data[0].changesPercentage, false));
                    document.getElementsByClassName("pricePercentageSpan")[0].style.fontSize = "19.5px";
                    document.getElementsByClassName("pricePercentageSpan")[0].style.fontWeight = "100";
                    //makes sure that only one interval (the current one) runs
                    searchHistory.push(quote);
                    let interval = window.setInterval(() => {
                        console.log(data[0].price);
                    }, 1000)
                    intervalHistory.push(interval);
                    if (intervalHistory.length > 2) {
                        intervalHistory.shift();
                    }
                    console.log(intervalHistory)
                    if (query) {
                        clearInterval(intervalHistory[0]);
                    }
                    query = true;

                    const stockChart = document.getElementById("stockChart");
                    let labels = [];
                    let price = [];
                    let chartArea = {
                        fill: 'start',
                        backgroundColor: 'rgb(20, 205, 50, 0.5)',
                    }
                    let priceHistory = new Stock(data[0].symbol).historicalChart('5min/');
                    priceHistory.then(data => {
                        console.log(data);
                        let dates = [];
                        if (price.length > 0) {
                            price = [];
                            labels = [];
                            dates = [];
                        }
                        let lastUpdatedDate = cleanMessage(data[0].date, 1, 1)
                        let lastUpdatedTime = cleanMessage(data[0].date, 0, 1);

                        for (let i = 0; i < data.length; i++) {
                            let timeDate = cleanMessage(data[i].date, 1, 1);
                            if (timeDate === lastUpdatedDate) {
                                dates.push(timeDate);
                            } else {
                                break;
                            }
                        }
                        console.log("quote interval length (79):" + dates.length);
                        let yesterdaysCloseDate = data[dates.length].date;
                        let yesterdaysClosePrice = data[dates.length].close * 1;
                        console.log(yesterdaysCloseDate + " " + yesterdaysClosePrice);
                        //data points 
                        for (let i = dates.length; i >= 0; i--) {
                            let time = data[i].date;
                            labels.push(time);
                            price.push(format(data[i].close * 1))
                        }
                        let currentPrice = data[0].close;
                        if (currentPrice < yesterdaysClosePrice) {
                            chartArea.fill = 'end';
                            chartArea.backgroundColor = 'rgb(255, 0, 0, 0.5)';
                        } else {
                            fill: 'start';
                            backgroundColor: 'rgb(20, 205, 50, 0.5)';
                        }
 
                    }).then(() => {
                        let chart = document.getElementById("stockChart")
                        console.log("$" + quote);
                        let chartStatus = Chart.getChart(chart);
                        if (chartStatus != undefined) {
                            chartStatus.destroy();
                        }
                        const data = {
                            labels: labels,
                            datasets: [{
                                label: quote,
                                data: price,
                                fill: true,
                                borderColor: 'rgb(211, 211, 211)',
                                backgroundColor: chartArea.backgroundColor,
                                fill: chartArea.fill,
                                tension: 0,
                            }],
                        };
                        let options = {
                            scales: {
                                x: {
                                    display: false,
                                }
                            },
                            tooltips: {
                                mode: 'label',
                            },
                        };
                        let lineChart = new Chart(chart, {
                            type: 'line',
                            data: data,
                            options: options,
                        })

                    })
                })
        }
    }, { once: true })
    document.getElementById("searchbar").removeEventListener('keyup', listener);
})
