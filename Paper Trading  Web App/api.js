const key = 'J8S17UJBIPF8KUXZ';
const key2 = 'fbccd5f0-e34c-4802-b20d-0a7bb573b34e';

function currentDay() {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const date = new Date().getDay();
    return days[date];
}
const today = currentDay();
console.log(today);

let marketQuotes = [
    { symbol: 'QQQ', multiplyer: '39.27'},
    { symbol: 'SPY', multiplyer: '10.026'},
    { symbol: 'DIA', multiplyer: '100.02'},
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
let aapl = new Stock("aapl").historicalChart(interval.oneMin);
aapl.then(data => {
    console.log(data);
})
//constant 
function returnMarketQuote() {
    //td ameritrade data
    indexData = []
    fetch("https://api.tdameritrade.com/v1/marketdata/quotes?apikey=DWJMYBQYEAPPGOAVBAASYIUI7IXPDKPL&symbol=SPY%2CQQQ%2CDIA")
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
        let indexPrice = Math.floor((data[marketQuote.symbol].bidPrice * marketQuote.multiplyer) * 100) / 100;
        index.innerHTML = Number(indexPrice).toFixed(2);
        displayGraph(marketQuote.symbol);
    })
}
function displayGraph(symbol) {
    const chart = document.getElementById(symbol + "Chart");
    console.log(chart);
}

setTimeout(returnMarketQuote, 500);
if (today != "Saturday" && today != "Sunday") {
    setInterval(returnMarketQuote, 5000);
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
