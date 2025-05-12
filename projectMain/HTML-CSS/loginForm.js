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
