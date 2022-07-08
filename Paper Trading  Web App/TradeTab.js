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
document.getElementById("searchbar").addEventListener('change', (searchBar) => {
    let quote = document.querySelector("#searchbar").value.toUpperCase();

    console.log(searchHistory);
    let tradeModal = document.getElementById("tradeModal");
    let listener = document.getElementById("searchbar").addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            fetch("https://financialmodelingprep.com/api/v4/company-outlook?symbol=" + quote + "&apikey=69f8cb94503175678fe3194af1c9e734")
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    if (!tradeModal.classList.contains("moveUpp")) {
                        changeClass("#tradeModal", "moveUpp", 'add')
                    }
                    // trade modal tab
                    let quoteTitle = document.querySelector(".quoteTitle");
                    quoteTitle.children[0].innerHTML = data.profile.symbol;
                    quoteTitle.children[1].innerHTML = data.profile.name;
                    quoteTitle.children[2].children[1].innerHTML = data.profile.exchange;
                    quoteTitle.children[3].children[1].innerHTML = data.profile.marketCap;
                    quoteTitle.children[4].children[1].innerHTML = data.profile.volume;
                    quoteTitle.children[5].children[1].innerHTML = format(data.profile.previousClose, false);
                    quoteTitle.children[6].children[1].innerHTML = format(data.profile.dayHigh, false);
                    quoteTitle.children[7].children[1].innerHTML = format(data.profile.dayLow, false);
                    quoteTitle.children[8].children[1].innerHTML = data.profile.sharesOutstanding;
                    //side bar
                    let sidebar = document.querySelector(".combine");
                    let stockInfo = sidebar.children[0];
                    stockInfo.children[0].children[1].innerHTML = data.profile.exchange;
                    stockInfo.children[1].children[1].innerHTML = format(data.profile.open, false);
                    stockInfo.children[2].children[1].innerHTML = format(data.profile.previousClose, false);
                    stockInfo.children[3].children[1].innerHTML = format(data.profile.dayLow, false) + " - " + format(data.profile.dayHigh, false);
                    stockInfo.children[4].children[1].innerHTML = format(data.profile.yearLow, false) + " - " + format(data.profile.yearHigh, false);
                    stockInfo.children[5].children[1].innerHTML = Number(format(data.profile.volume, false)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let quotePrice = document.querySelector(".quotePrice");
                    let priceColor = priceDirection(format(data.profile.changesPercentage, true));
                    //style
                    quotePrice.children[0].innerHTML = "$" + Number(data.profile.price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + "<span class='priceChangeSpan'>" + format(data.profile.change, true) + "</span>" + "<span class='pricePercentageSpan'>" + " " + "(" + format(data.profile.changesPercentage, false) + "%" + ")" + "</span>";
                    document.getElementsByClassName("priceChangeSpan")[0].style.color = priceDirection(format(data.profile.changesPercentage, true));
                    document.getElementsByClassName("priceChangeSpan")[0].style.fontSize = "21px";
                    document.getElementsByClassName("pricePercentageSpan")[0].style.color = priceDirection(format(data.profile.changesPercentage, false));
                    document.getElementsByClassName("pricePercentageSpan")[0].style.fontSize = "19.5px";
                    document.getElementsByClassName("pricePercentageSpan")[0].style.fontWeight = "100";
                    //makes sure that only one interval (the current one) runs
                    searchHistory.push(quote);
                    let interval = window.setInterval(() => {
                        console.log(data.profile.price);
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
                    let priceHistory = new Stock(data.profile.symbol).historicalChart('5min/');
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