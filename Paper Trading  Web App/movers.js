import { priceDirection } from '/ColorChanger.js';
//naming convention
const market = {
    gainers: 'gainers',
    losers: 'losers',
}
function format(number, addPlus) {
    if (number > 0 && addPlus) {
        return "+" + Number(Math.floor(number * 100) / 100).toFixed(2);
    } else {
        return Number(Math.floor(number * 100) / 100).toFixed(2);
    }
}
export { format }
class Mover {
    constructor(marketDirection) {
        this.marketDirection = marketDirection
    }
    fetchData() {
        fetch('https://financialmodelingprep.com/api/v3/stock_market/' + this.marketDirection + '?apikey=69f8cb94503175678fe3194af1c9e734')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.displayMovers(data) 
            }).catch((error) => {
                console.log(error);
            })
    }
    displayMovers(data) {
        let Created = false;
        if (!Created) {
            this.createMover(data, Created);
        }
        let movers = document.querySelectorAll('.' + this.marketDirection);
        let moverPercentages = [];
        for (let i = 0; i < data.length; i++) {
            moverPercentages.push(format(data[i]["changesPercentage"], true));
            movers[i].children[1].innerHTML = data[i]["symbol"];
            movers[i].children[2].innerHTML = format(data[i]["price"], false);
            movers[i].children[3].innerHTML = format(data[i]["change"], true);
            movers[i].children[4].innerHTML = '(' + moverPercentages[i] + '%' + ')';
            //color algorithm
            let displayedColor = priceDirection(moverPercentages[i]);
            movers[i].children[0].style.background = displayedColor;
            movers[i].children[3].style.color = displayedColor;
            movers[i].children[4].style.color = displayedColor;
        }
    }
    createMover(data, Created) {
        let moverContent = document.getElementById(this.marketDirection);
        let marketDir = this.marketDirection;
        data.forEach( () => {
            let moverDiv = document.createElement("header");
            moverDiv.classList.add("mover");
            moverDiv.classList.add(marketDir);
            let color = document.createElement("div");
            color.classList.add("color");
            moverDiv.append(color);
            let title = document.createElement("h4");
            moverDiv.append(title);
            let price = document.createElement("h4");
            price.classList.add("details");
            price.style.fontWeight = "600";
            moverDiv.append(price);
            let change = document.createElement("h4");
            change.classList.add("details");
            change.style.fontWeight = "600";
            moverDiv.append(change);
            let percentage = document.createElement("h4");
            percentage.style.marginLeft = "6px";
            percentage.style.fontWeight = "300";
            moverDiv.append(percentage);
            moverContent.append(moverDiv);
        });
        Created = true;
    }
}

function getMovers() {
    let bullish = new Mover(market.gainers);
    bullish.fetchData();
    let bearish = new Mover(market.losers);
    bearish.fetchData();
}
window.setTimeout(getMovers, 500);
window.setInterval(getMovers, 300000)