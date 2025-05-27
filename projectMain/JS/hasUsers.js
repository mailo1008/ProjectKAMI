const sql = require('mssql/msnodesqlv8'); 
const bcrypt = require('bcrypt'); 

const config = { 
  server: 'localhost', 
  database: 'KAMI_DB', 
  driver: 'msnodesqlv8', 
  options: { 
    trustedConnection: true, 
    trustServerCertificate: true 
  } 
}; 

async function hashAllPasswords() { 
  try { 
    await sql.connect(config); 
    const result = await sql.query('SELECT UserId, Password FROM Users'); 

    for (let user of result.recordset) { 
      const hashed = await bcrypt.hash(user.Password, 10); 
      await sql.query`UPDATE Users SET Password = ${hashed} WHERE UserId = ${user.UserId}`; 
      console.log(`Updated user ID ${user.UserId}`); 
    } 

    console.log(' All passwords hashed!'); 

    process.exit(); 

  } catch (err) { 
    console.error(' Error hashing passwords:', err.message); 
    process.exit(1); 
  } 
} 

hashAllPasswords(); 