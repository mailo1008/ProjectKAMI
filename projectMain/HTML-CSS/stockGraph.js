const portfolioContainer = document.getElementById("portfolio");
const totalValueEl = document.getElementById("totalValue");
const selectedStockLabel = document.getElementById("selectedStock");
let chart;

// 🔹 Fetch holdings and display them
async function displayPortfolio() {
  try {
    const res = await fetch("http://localhost:3000/api/portfolio");
    const data = await res.json();

    portfolioContainer.innerHTML = "";
    let totalValue = 0;

    for (const item of data) {
      // You can use static prices or extend backend to send current price
      const dummyPrice = 100 + Math.random() * 100; // Replace with real price logic if needed
      const value = item.shares * dummyPrice;
      totalValue += value;

      const p = document.createElement("p");
      p.innerHTML = `<strong><a href="#" class="stock-link" data-symbol="${item.symbol}">${item.symbol}</a></strong>: ${item.shares} shares × $${dummyPrice.toFixed(2)} = $${value.toFixed(2)}`;
      portfolioContainer.appendChild(p);
    }

    totalValueEl.textContent = `$${totalValue.toFixed(2)}`;

    document.querySelectorAll(".stock-link").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        const symbol = event.target.getAttribute("data-symbol");
        updateChart(symbol);
      });
    });

  } catch (err) {
    portfolioContainer.innerHTML = `⚠️ Error loading portfolio: ${err.message}`;
  }
}

// 🔹 Draw the historical chart
async function updateChart(symbol) {
  selectedStockLabel.textContent = symbol;

  try {
    const res = await fetch(`http://localhost:3000/api/history/${symbol}`);
    const data = await res.json();

    const dates = data.map(row => new Date(row.Date).toLocaleDateString());
    const prices = data.map(row => row.Close);

    const chartData = {
      labels: dates,
      datasets: [{
        label: `${symbol} Close Price`,
        data: prices,
        borderColor: "#4b5320",
        backgroundColor: "rgba(107, 142, 35, 0.2)",
        tension: 0.1
      }]
    };

    const ctx = document.getElementById("historyChart").getContext("2d");

    if (chart) {
      chart.data = chartData;
      chart.update();
    } else {
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

  } catch (err) {
    document.getElementById("historyChart").outerHTML = `<p style="color: red;">⚠️ Error loading chart: ${err.message}</p>`;
  }
}

// 🔹 Initial load
displayPortfolio();
updateChart("AAPL");  // Default chart