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

//SQL Server connection with Windows Authentication 

const sql = require('mssql/msnodesqlv8');
const config = {
    server: 'localhost',
    database: 'KAMI_DB',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

app.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        await sql.connect(config);
        // checking for errors,console.log('Database connected successfully');

        const result = await sql.query`SELECT * FROM Users WHERE Email=${username}`;
        //console.log('Query parameters:', username); // Add this to see what's being searched
        //console.log('Full query result:', result); // Add this to see complete query response

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

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
})
