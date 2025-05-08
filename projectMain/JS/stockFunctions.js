//Dummy infor for testing
let acctBalance = 1000;
let stockCount = 0;
let portfolio = [];


//Set stock prices
let applePrice = assignStockPrice();
let amznPrice = assignStockPrice();
let dashPrice = assignStockPrice();
let nvdaPrice = assignStockPrice();

//Create stock objects
let apple = ["AAPL", applePrice];
let amzn = ["AMZN", amznPrice];
let dash = ["DASH", dashPrice];
let nvda = ["NVDA", nvdaPrice];

//Assigns random number to stock's price, should only be called once
function assignStockPrice(){
    return Math.floor(Math.random() * 1000)
}

//Adjusts acct for buying stock
function buyStock(stock, amt){
    acctBalance = acctBalance - (stock[1] * amt);
    portfolio.push(stock)
    stock.stockCount = amt;
}

//Adjusts acct for selling stock
function sellStock(stock, amt){
    acctBalance = acctBalance + (stock * amt);
}

function getPrice(profileItem){
    console.log(profileItem);
    let portfolio = profileItem;
    let price = 3;
    return price
}

/*testing output values of each
console.log(applePrice);
console.log(amznPrice);
console.log(dashPrice);
console.log(nvdaPrice);
*******/

/*tesing buying stock
buyStock(apple, 1);
console.log(portfolio);
console.log(acctBalance);
********/

//tesing selling stock
//add stock to portfolio
buyStock(apple, 12);
buyStock(nvda, 10);
buyStock(dash, 23);
console.log(portfolio);
sellStock(getPrice(portfolio[3]), 11);
console.log(acctBalance);
//select and sell