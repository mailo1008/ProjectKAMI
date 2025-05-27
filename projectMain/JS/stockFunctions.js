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
function buyStock(stockName, amt) {
    if (findStock(stockName) != null) {
        const stock = findStock(stockName);
        const totalCost = stock.price * amt;     
        // Check if purchase would result in negative balance
        if (totalCost > acctBalance) {
            alert("Insufficient funds for this transaction!");
            return false;
        }
        if (findPortfolio(stockName) != null) {
            const portfolioStock = findPortfolio(stockName);
            portfolioStock.amt += amt;
            acctBalance = acctBalance - totalCost;
        } else {
            stock.amt += amt;
            portfolio.set(stockID, stock);
            stockID++;
            acctBalance = acctBalance - totalCost;
        }
        return true;
    } else {
        console.log(`Stock "${stockName}" not found.`);
        return false;
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
function sellStock(stockName, amt) {
    if (findStock(stockName) != null) {
        if (findPortfolio(stockName) != null) {
            const stock = findPortfolio(stockName);
            if (amt <= stock.amt) {
                acctBalance = acctBalance + (stock.price * amt);
                stock.amt -= amt;
                return true;  // Return true when sale is successful
            } else {
                alert("You cannot sell more stock than you have!");
                return false;
            }
        } else {
            alert("You don't own any shares of this stock!");
            return false;
        }
    } else {
        console.log(`Stock "${stockName}" not found.`);
        return false;
    }
}

// Update toggle function
function toggleSellMode() {
    const toggle = document.getElementById("modeToggle");
    const label = document.getElementById("buyingSelling");
    if (toggle.checked) {
        label.textContent = "Sell";
    } else {
        label.textContent = "Buy";
    }
}

//Handles trade once form is submitted
function handleTrade(event) {
    event.preventDefault();
    
    const isSelling = document.getElementById("modeToggle").checked;
    const stockName = document.getElementById("stock").value;
    const amount = parseInt(document.getElementById("amount").value);
    const stock = findStock(stockName);
    const totalCost = stock.price * amount;
    //Confirmation message:    
    const confirmMessage = `Do you want to ${isSelling ? 'sell' : 'buy'} ${amount} shares of ${stockName} for ${totalCost.toLocaleString()}?`;
    if (confirm(confirmMessage)) {
        const resultDiv = document.getElementById("tradeResult");
        let success;        
        if (isSelling) {
            success = sellStock(stockName, amount);
        } else {
            success = buyStock(stockName, amount);
        }        
        if (success) {
            resultDiv.innerHTML = `
                <div class="transaction-result">
                    <h2>Transaction Complete!</h2><br/>
                    ${isSelling ? 'Sold' : 'Bought'} ${amount} shares of ${stockName}<br/>
                    <br/>
                    Total Price: &dollar; ${totalCost.toLocaleString()}</p><br/>
                    Current ${stockName} shares owned: ${findPortfolio(stockName) ? findPortfolio(stockName).amt : 0}<br/>
                    New Account Balance: &dollar; ${acctBalance.toLocaleString()}
                </div>`;
        } else {
            resultDiv.innerHTML = `
                <div class="transaction-result">
                    <h2>Transaction Failed!</h2><br/>
                    You were unable to exchange ${amount} shares of ${stockName} due to insufficient balance.<br/>
                    <br/>
                    Total Price: &dollar;${totalCost.toLocaleString()}.00<br/>
                    Current ${stockName} shares owned: ${findPortfolio(stockName) ? findPortfolio(stockName).amt : 0}<br/>
                    Account Balance: &dollar;${acctBalance.toLocaleString()}.00
                </div>`;
        }
    }
}

function calculatePreview() {
    const stockName = document.getElementById("stock").value;
    const amount = parseInt(document.getElementById("amount").value) || 0;
    const previewDiv = document.getElementById("costPreview");
    const priceDiv = document.getElementById("currentPrice");
    const ownedDiv = document.getElementById("currentOwned");
    const imageDiv = document.getElementById("graphImage");
    
    if (stockName) {
        const stock = findStock(stockName);
        priceDiv.innerHTML = `
            <h4>Current Price:</h4><br/>
            Current Price per Share: &dollar;${stock.price.toLocaleString()}.00`;

        ownedDiv.innerHTML = `
            <h4>Current Shares in ${stock.stockName.toLocaleString()}:</h4><br/>
            ${stock.amt.toLocaleString()}`;

        imageDiv.src = `../img/${stock.stockName}.png`;
        
        if (amount > 0) {
            const totalCost = stock.price * amount;
            previewDiv.innerHTML = `Estimated Total Cost: &dollar;${totalCost.toLocaleString()}.00`;
        } else {
            previewDiv.innerHTML = "";
        }
    } else {
        priceDiv.innerHTML = "";
        previewDiv.innerHTML = "";
        imageDiv.src=``;
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