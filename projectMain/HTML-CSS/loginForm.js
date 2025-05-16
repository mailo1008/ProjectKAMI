
//Creating dummy LogIn 
const users ={ "Jane1@xyz.com": "pass1",
    "Bob2@xyz.com" : "pass2",
    "Doe3@xyz.com" : "pass3"
};

//Setting the code to get elements from document
const loginForm= document.getElementById("loginForm");
const messageElement = document.getElementById("incorrectLogin");
let isLoggedIn= false;

//set up function to validate the user to log into account
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    if (users[usernameInput] === passwordInput) {
        const username= usernameInput.split('@')[0];
        window.location.href= `Account Value.html?user=${encodeURIComponent(username)}`;
        isLoggedIn= true;
    } else {
        messageElement.textContent = "Incorrect username or password!";
    }
});

/* Testing for adding in user to User table
const sql= require('mssql/msnodesqlv8');
const bcrypt= require('bcrypt');

const config={
    server:'localhost',
    database:'ProjectKAMI_DB',
    driver:'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

async function insertTestUser() {
    const userid= 1;
    const email= 'Jane1@xyz.com';
    const fname= 'Jane';
    const lname='ThunderBird'
    const DOB= 1/25/1993;
    const plainPassword = 'pass1';
    const hash= await bcrypt.hash(plainPassword,10);

    try{
        await sql.query(config);
        await sql.query`INSERT INTO Users(UserID,Email, FirstName, LastName, DateOfBirth, Password)VALUES (${userid}, ${email}, ${fname}, 
        ${lname}, ${DOB}, ${hash})`;
        console.log('Test user added: Jane1@xyz.com/pass1');
        process.exit();
    }catch (err) {
        console.error('Error inserting test user:', err.message);
        process.exit(1);
    }
    }
insertTestUser();

*/