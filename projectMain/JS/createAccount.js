const createAccount = document.getElementById("createAccount");
const messageElement = document.getElementById("LoginMessage");
let isLoggedIn = false;

//set up function to validate that the email isnt registered, and sign them up New User
createAccount.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("psw").value;

    //call for createAccount API
    try {
        const response = await fetch('http://localhost:3000/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                dob,
                password
            })
        });

        const data = await response.json();
        if (data.success) {
            const displayUsername = `${email.split('@')[0]}`;
            isLoggedIn = true;
            window.location.href = `Account Value.html?user=${encodeURIComponent(displayUsername)}`
        } else {
            isLoggedIn = false;
            messageElement.textContent = "Account already exists!";
        }
    } catch (err) {
        console.log('Eror details:', err);
        messageElement.textContent = "Error occured, please try again";
        isLoggedIn = false;
    }
});