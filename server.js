//import all of the modules needed to be used
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');

//Have express read the files that it needs to for displaying of pages
app.use(express.static(path.join(__dirname, 'projectMain', 'HTML-CSS')));
app.use('/img', express.static(path.join(__dirname, 'projectMain', 'img')));
app.use('/vid', express.static(path.join(__dirname, 'projectMain', 'vid')));

app.use(cors());
app.use(express.json()); //For JSON Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use('/JS', express.static(path.join(__dirname, 'projectMain', 'JS')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'projectMain', 'HTML-CSS', 'index.html'));
});

//app.use(cors());
//app.use(express.json());

//SQL Server connection with Windows Authentication 

const sql = require('mssql/msnodesqlv8');
const { NVarChar } = require('msnodesqlv8');
const config = {
    server: 'localhost',
    database: 'ProjectKAMIDB',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
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

app.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        await sql.connect(config);
         console.log('Database connected successfully');

        const result = await sql.query`SELECT * FROM Users WHERE Email=${username}`;
        console.log('Query parameters:', username); // Add this to see what's being searched
        console.log('Full query result:', result); // Add this to see complete query response

        const user = result.recordset[0];
        if (user && await bcrypt.compare(password, user.Password)) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/createAccount', async (req,res)=>{
    const { firstName, lastName, email, dob, password } = req.body;
    let pool;

    try{
        pool= await sql.connect(config);
        const hashedPassword= await bcrypt.hash(password,10);
        
    const result= await pool.request()
    .input('dob', sql.Date, new Date(dob))
    .input('email', sql.NVarChar,email)
    .input('firstName', sql.NVarChar, firstName)
    .input('lastName', sql.NVarChar, lastName)
    .input('password', sql.NVarChar,hashedPassword)
    .query(`
    IF NOT EXISTS( Select Email From Users WHERE Email= @email)
    BEGIN
    INSERT INTO Users( DateOfBirth, Email, FirstName, LastName, Password)
    VALUES (@dob, @email, @firstName, @lastName, @password);
    END
    ELSE 
    BEGIN
    THROW 50000,'Email already exists',1;
    END
    `);

    res.status(201).json({
        success:true,
        message:'Account created successfully'
    });

    } catch (err) {
        console.error('Error details:', err);
        res.status(500).json({
            success:false,
            message: err.message ||'An error occured during account creation'
        });
    } finally{
        if (pool){
            try{
                await sql.close(); // Close connection 
            }catch(err){
                console.error('Error closing connection',err);
            }
        }
    }
    });

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
})

