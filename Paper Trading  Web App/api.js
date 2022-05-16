const key = 'J8S17UJBIPF8KUXZ';
const key2 = 'fbccd5f0-e34c-4802-b20d-0a7bb573b34e';
import { format } from '/movers.js';
function currentDay() {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const date = new Date().getDay();
    return days[date];
}
export {currentDay}
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
 
//constant 
function returnMarketQuote() {
    //td ameritrade data
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
        let indexPrice = format(data[marketQuote.symbol].bidPrice * marketQuote.multiplyer, false)
        index.innerHTML = indexPrice;
    })
}

function displayGraph(symbol) {
    const chart = document.getElementById(symbol + "Chart");    
    console.log(chart);
    let labels = [];
    let price = [];

    let priceHistory = new Stock(symbol).historicalChart(interval.fiveMin);
    priceHistory.then(data => {
        console.log(priceHistory);
        if (price.length > 0) {
            price = [];
            labels = [];
        }
        for (let i = 78; i >= 0; i--) {
            let time = data[i].date;
            //time = time.substring(10);
            labels.push(time);
            let multiplyer = marketQuotes.find(item => item.symbol === symbol).multiplyer;
            price.push(format(data[i].close * multiplyer));
        }
    }).then(() => {
        const data = {
            labels: labels,
            datasets: [{
                label: symbol,
                data: price,
                fill: true,
                borderColor: 'rgb(211, 211, 211)',
                backgroundColor: 'rgb(50, 205, 50, 0.5)',
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
        displayGraph(symbol.symbol);
    })
}, 500)
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
