const apiKey = "A9CGW2QA56GA0KOU";
const portfolio = [
  { symbol: "AAPL", shares: 1 },
  { symbol: "MSFT", shares: 1 },
  { symbol: "GOOGL", shares: 1 },
  { symbol: "AMZN", shares: 1 },
  { symbol: "NVDA", shares: 1 }
];

const portfolioContainer = document.getElementById("portfolio");
const totalValueEl = document.getElementById("totalValue");
const selectedStockLabel = document.getElementById("selectedStock");

let totalValue = 0;
let chart;

async function fetchPrice(symbol) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
    throw new Error(`Price data for ${symbol} not available.`);
  }

  return parseFloat(data["Global Quote"]["05. price"]);
}

async function displayPortfolio() {
  portfolioContainer.innerHTML = "";
  totalValue = 0;

  try {
    for (const stock of portfolio) {
      const price = await fetchPrice(stock.symbol);
      const value = price * stock.shares;
      totalValue += value;

      const item = document.createElement("p");
      item.innerHTML = `<strong><a href="#" class="stock-link" data-symbol="${stock.symbol}">${stock.symbol}</a></strong>: ${stock.shares} shares × $${price.toFixed(2)} = $${value.toFixed(2)}`;
      portfolioContainer.appendChild(item);
    }

    totalValueEl.textContent = `$${totalValue.toFixed(2)}`;

    document.querySelectorAll(".stock-link").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        const symbol = event.target.getAttribute("data-symbol");
        updateChart(symbol).catch(err => {
          document.getElementById("historyChart").outerHTML = `<p style="color: red;">⚠️ Error loading chart: ${err.message}</p>`;
        });
      });
    });
  } catch (err) {
    portfolioContainer.innerHTML = `⚠️ Error loading portfolio: ${err.message}`;
  }
}

async function updateChart(symbol) {
  selectedStockLabel.textContent = symbol;

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data["Time Series (Daily)"]) {
    throw new Error(`Chart data for ${symbol} not available.`);
  }

  const timeSeries = data["Time Series (Daily)"];
  const dates = Object.keys(timeSeries).slice(0, 30).reverse();
  const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));

  const chartData = {
    labels: dates,
    datasets: [{
      label: `${symbol} Price`,
      data: prices,
      borderColor: "#4b5320",
      backgroundColor: "rgba(107, 142, 35, 0.2)",
      tension: 0.1
    }]
  };

  if (chart) {
    chart.data = chartData;
    chart.update();
  } else {
    const ctx = document.getElementById("historyChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
}

displayPortfolio().catch(err => {
  portfolioContainer.innerHTML = `⚠️ Error loading portfolio: ${err.message}`;
});

updateChart("AAPL").catch(err => {
  document.getElementById("historyChart").outerHTML = `<p style="color: red;">⚠️ Error loading chart: ${err.message}</p>`;
});
