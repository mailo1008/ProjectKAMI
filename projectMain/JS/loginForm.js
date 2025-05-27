
//Creating dummy LogIn (now in the database)
/*const users ={ "Jane1@xyz.com": "pass1",
    "Bob2@xyz.com" : "pass2",
    "Doe3@xyz.com" : "pass3"
};*/

//Setting the code to get elements from document
const loginForm = document.getElementById("loginForm");
const messageElement = document.getElementById("LoginMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form input values
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }) // Use correct field names
    });

    const data = await response.json();

    if (response.ok) {
      // Login successful
      localStorage.setItem('userId', data.userId);  // Save user ID
      window.location.href = 'AccountValue.html';   // Redirect to portfolio
    } else {
      messageElement.textContent = data.error || "Login failed. Try again.";
    }

  } catch (err) {
    console.error("Login error:", err);
    messageElement.textContent = "Server error. Please try again.";
  }
});