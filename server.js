const express = require('express');
const sql = require('mssql/msnodesqlv8');  // Windows Auth driver
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// SQL Server config authentication
const config = {
  server: 'localhost',
  database: 'projectKAMIDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

// Route to get user portfolio (UserID = 1)
app.get('/api/portfolio', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT s.TickerSymbol AS symbol, uh.Quantity AS shares
      FROM UserHoldings uh
      JOIN Stocks s ON uh.StockID = s.StockID
      WHERE uh.UserID = 1
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get price history for a stock
app.get('/api/history/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('symbol', sql.NVarChar, symbol);

    const result = await request.query(`
      SELECT ph.Date, ph.[Close]
      FROM PriceHistory ph
      JOIN Stocks s ON ph.StockID = s.StockID
      WHERE s.TickerSymbol = @symbol
      ORDER BY ph.Date
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server starter
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});