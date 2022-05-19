const key = 'J8S17UJBIPF8KUXZ';
const key2 = 'fbccd5f0-e34c-4802-b20d-0a7bb573b34e';
import { format } from '/movers.js';
function currentDay() {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const date = new Date().getDay();
    return days[date];
}
export { currentDay }
const today = currentDay();
console.log(today);
function cleanMessage(message) {
    let cleanedMessage = message.split(' ');
    cleanedMessage.splice(1, 1);
    cleanedMessage = cleanedMessage.join(' ');
    return cleanedMessage;
}

let marketQuotes = [
    { symbol: 'QQQ', multiplyer: '1', index: '^IXIC', num: 2},
    { symbol: 'SPY', multiplyer: '1', index: '^GSPC', num: 1},
    { symbol: 'DIA', multiplyer: '1', index: '^DJI', num: 0},
]
const interval = {
    oneMin: '1min/',
    fiveMin: '5min/',
    fifteenMin: '15min/',
    thirtyMin: '30min/',
    hour: '1hour/',
}
let historicSeries = {
    daily: '',
    stock_dividends: "stock_dividend/",
    stock_splits: "stock_split/",
}

//main class
class Stock {
    constructor(symbol) {
        this.symbol = symbol.toUpperCase();
    }
    async historicalData(series) {
        const response = await fetch("https://financialmodelingprep.com/api/v3/historical-price-full/" + series + this.symbol + "?apikey=69f8cb94503175678fe3194af1c9e734");
        const data = await response.json();
        return data;
 
    }
    async historicalChart(interval) {
        const response = await fetch('https://financialmodelingprep.com/api/v3/historical-chart/' + interval + this.symbol + '?apikey=69f8cb94503175678fe3194af1c9e734');
        const data = await response.json();
        return data;
    }
}
 
//constant 
function returnMarketQuote() {
    //td ameritrade data
    fetch("https://financialmodelingprep.com/api/v3/quote/%5EGSPC,%5EIXIC,%5EDJI?apikey=69f8cb94503175678fe3194af1c9e734")
        .then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            displayIndexes(data);
        })
}
function displayIndexes(data) {
    marketQuotes.forEach((marketQuote) => {
        const index = document.querySelector("." + marketQuote.symbol)
        index.style.fontWeight = "400";
        console.log(marketQuote);
        let indexPrice = format(data[marketQuote.num].price * marketQuote.multiplyer, false)
        index.innerHTML = indexPrice;
        let multiplyer = marketQuotes.find(item => item.symbol === marketQuote.symbol).multiplyer;
        let previousClose = data[marketQuote.num].previousClose;
        let priceChange = data[marketQuote.num].change;
        let purePercentage = data[marketQuote.num].changesPercentage;
        let percentageChange = '(' + format(purePercentage, true) + '%)';
        console.log(percentageChange);
        let changeText = document.querySelector("." + marketQuote.symbol + "change")
        changeText.innerHTML = format(priceChange, true) + " " + percentageChange;
        if (indexPrice > previousClose) {
                changeText.style.color = "#4EB849";
            } else {
                changeText.style.color = "rgb(255, 0, 0)";
            }
        
    })
}
 

function displayGraph(symbol, interval) {
    const chart = document.getElementById(symbol + "Chart");    
    console.log(chart);
    let labels = [];
    let price = [];
    let chartArea = {
        fill: 'start',
        backgroundColor: 'rgb(20, 205, 50, 0.5)',
    }
    let priceHistory = new Stock(symbol).historicalChart(interval);
    priceHistory.then(data => {
 
        console.log(data);
        let dates = []
        if (price.length > 0) {
            price = [];
            labels = [];
            dates = [];
        }
        let lastUpdatedDate = cleanMessage(data[0].date)
        console.log('last updated date: ' + lastUpdatedDate);
        for (let i = 0; i < data.length; i++) {
            let timeDate = cleanMessage(data[i].date);
            if (timeDate === lastUpdatedDate) {
                dates.push(timeDate);
            } else {
                break;
            }
        }
 
        console.log(dates);
        let multiplyer = 1;
        let yesterdaysCloseDate = data[dates.length].date;
        let yesterdaysClosePrice = data[dates.length].close * multiplyer;
        console.log('yesterdays close: ' + yesterdaysCloseDate + ' closing price: ' + yesterdaysClosePrice);
        // datapoints
        for (let i = dates.length - 1; i >= 0; i--) {
            let time = data[i].date;
            labels.push(time);
            price.push(format(data[i].close * multiplyer));
        }
        let currentPrice = data[0].close * multiplyer;
        console.log('current price:' + currentPrice);

        if (currentPrice < yesterdaysClosePrice) {
            chartArea.fill = 'end';
            chartArea.backgroundColor = 'rgb(255, 0, 0, 0.5)';
        } else {
            fill: 'start';
            backgroundColor: 'rgb(20, 205, 50, 0.5)';
        }
    }).then(() => {
        let chartStatus = Chart.getChart(chart);
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
        const data = {
            labels: labels,
            datasets: [{
                label: symbol,
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
                mode: 'label'
            },
        }
        let lineChart = new Chart(chart, {
            type: 'line',
            data: data,
            options: options
        })
    })
}
setTimeout(function () {
    marketQuotes.forEach(symbol => {
        displayGraph(symbol.index, interval.fiveMin);
    })
}, 500)
setTimeout(returnMarketQuote, 500);

if (today != "Saturday" && today != "Sunday") {
    setInterval(returnMarketQuote, 5000);
    setInterval(function () {
        marketQuotes.forEach(symbol => {
            displayGraph(symbol.symbol, interval.fiveMin);
            console.log("interval");
        })
    }, 300000)
    
} 

function returnQuote() {
    let quote = document.getElementById("searchbar").value;
    fetch("https://api.tdameritrade.com/v1/marketdata/quotes?apikey=DWJMYBQYEAPPGOAVBAASYIUI7IXPDKPL&symbol=" + quote)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data[quote.toUpperCase()]["askPrice"]);
        })
}
function openModal() {

}
