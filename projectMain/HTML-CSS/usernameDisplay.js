const messageElement = document.getElementById("usernameDisplay");

document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);

    const username = urlParams.get('user');

    if (username) {

    messageElement.textContent = `Welcome, ${username}!`;

            }
    })