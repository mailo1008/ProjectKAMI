//Dummy info for testing
let acctBalance = 1000000;                                  //one million, balance should be stored in database & pulled from there
let stockCount = 0;                                         //same as above, stored in database and pulled
let stockID = 1;                                            //this was set up for iterating the Map, may not be best practice
const portfolio = new Map();                                //creates a portfolio map
const possibleStocks = new Map();                           //creates a portfolio map to store stocks on offewr

//Set stock prices
//At a later time, these should be either live updated by an API or pulled from database (or both!)
let applePrice = assignStockPrice();
let amznPrice = assignStockPrice();
let dashPrice = assignStockPrice();
let nvdaPrice = assignStockPrice();

//Create our stock objects
let apple = {stockName: "AAPL", price: applePrice, amt: stockCount};
let amzn = {stockName: "AMZN", price: amznPrice, amt: stockCount};
let dash = {stockName: "DASH", price: dashPrice, amt: stockCount};
let nvda = {stockName: "NVDA", price: nvdaPrice, amt: stockCount};

//add our available stocks to the possibleStocks map
possibleStocks.set(1, apple);
possibleStocks.set(2, amzn);
possibleStocks.set(3, dash);
possibleStocks.set(4, nvda);

//Assigns random number to stock's price, should only be called once during runthrough to assign price
//This is done due to lack of API or database to pull from
//Can be commented out later if need be
function assignStockPrice(){
    return Math.floor(Math.random() * 1000)
}

//Adjusts acct for buying stock
//Because user can only select from a pre-existing drop down list of choices, should not need many catches for errors
/******************************************************
* NEEDS TO BE SET UP TO CAPTURE INFO FROM THE DOCUMENT
*******************************************************/
function buyStock(stockName, amt){
    if (findStock(stockName) != null){                          //Checks if the stock they want exists (it should) - this step may be unnecessary but I needed it for testing
        if (findPortfolio(stockName) != null){                  //If it does exist, check if they have it in their portfolio
            const stock = findPortfolio(stockName);             //store the queried stock in a variable
            stock.amt += amt;
            acctBalance = acctBalance - (stock.price * amt);
        } else {                                                //if they do not have the requested stock, this will add it to their portfolio
            const stock = findStock(stockName);
            stock.amt += amt;
            portfolio.set(stockID, stock);
            stockID++;
            acctBalance = acctBalance - (stock.price * amt);
        }
    } else {
        console.log(`Stock "${stockName}" not found.`);         //This may not happen for our use case, but keeping for testing
    }
    
}

//this is a query to see if there requested stock EXISTS
//this function was used for testing purposes, may not be needed for final product, may be removed in Refactoring
function findStock(name){
    for (let [id, stocks] of possibleStocks){
        if (stocks.stockName === name){
            return stocks;                                      //if stock is found
        }
    }
    return null;                                                //if stock is not found
}

//queries the user's portfolio to see if the requested stock exists
//this is needed to see if the program should create a new object or can use an existing one
function findPortfolio(name){
    for (let [id, stocks] of portfolio){
        if (stocks.stockName === name){
            return stocks;
        }
    }
    return null;
}

//Adjusts acct for selling stock
//very similar to buyStock, operations are simply inverted
/******************************************************
* NEEDS TO BE SET UP TO CAPTURE INFO FROM THE DOCUMENT
*******************************************************/
function sellStock(stockName, amt){
    if (findStock(stockName) != null){
        if (findPortfolio(stockName) != null){
            const stock = findPortfolio(stockName);
            if (amt < stock.amt) {
                acctBalance = acctBalance + (stock.price * amt);
                stock.amt -= amt;
            } else {
                console.log(`You cannot sell more stock than you have!`);
            }
        } else {
            const stock = findStock(stockName);
            const stockToAdd = {stockName: stock.stockName, price: stock.price, amt: stock.amt};
            stockToAdd.amt -= amt;
            portfolio.set(stockID, stockToAdd);
            stockID++;
            acctBalance = acctBalance + (stock.price * amt);
        }
    } else {
        console.log(`Stock "${stockName}" not found.`);
    }
}


/*********************************************
* TESTING CODE FOR FUNCTIONS - DO NOT REMOVE *
**********************************************/


/*testing randomizer
console.log(applePrice);
console.log(applePrice); //to test if it re-runs and changes price randomizer
console.log(amznPrice);
console.log(dashPrice);
console.log(nvdaPrice);
*/

/*tesing buying stock
buyStock("AAPL", 15);
buyStock("DASH", 12);
buyStock("NVDA", 8);
buyStock("TACO", 3);
console.log(portfolio);
console.log(acctBalance);
buyStock("DASH", 2);
console.log(portfolio);
console.log(acctBalance);
*/


/*tesing selling stock
//add stock to portfolio
buyStock("AAPL", 12);
buyStock("NVDA", 10);
buyStock("DASH", 23);
console.log(portfolio);
console.log(acctBalance);
sellStock("AAPL", 10);
console.log(portfolio);
console.log(acctBalance);
sellStock("AAPL", 5); //tests selling stock when no more is available
*/