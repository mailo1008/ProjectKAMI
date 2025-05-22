
//Creating dummy LogIn (now in the database)
/*const users ={ "Jane1@xyz.com": "pass1",
    "Bob2@xyz.com" : "pass2",
    "Doe3@xyz.com" : "pass3"
};*/

//Setting the code to get elements from document
const loginForm = document.getElementById("loginForm");
const messageElement = document.getElementById("LoginMessage");
let isLoggedIn = false;

//set up function to validate the user to log into account
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    //Call Login API 
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();
        if (data.success) {
            //if authentication successful
            localStorage.setItem('loggedIn', 'true');
            isLoggedIn = true;

            //extract username for the URL
            const displayUsername = username.split('@')[0];

            //redirect to account value page
            window.location.href = `Account Value.html?user=${encodeURIComponent(displayUsername)}`
        } else {
            messageElement.textContent = "Incorrect Username or Password!";
            isLoggedIn = false;
        }
    } catch (err) {
        console.log('Eror details:', err);
        messageElement.textContent = "Error occured, please try again";
        isLoggedIn = false;
    }
});
