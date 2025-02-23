document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Extract email and password from form inputs
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    // Ensure the backend URL is correctly set
    const response = await fetch('http://localhost:3000/login', { // Replace with the correct backend endpoint
      method: 'POST', // Use the correct HTTP method
      headers: { 
        'Content-Type': 'application/json' // Inform the backend you're sending JSON
      },
      body: JSON.stringify({ email, password }) // Convert the data into JSON format
    });

    if (response.ok) {
      // Redirect to the project page on successful login
      window.location.href = 'home.html';
    } else {
      // Handle non-200 responses
      const errorMessage = await response.text();
      alert(`Login failed: ${errorMessage}`);
    }
  } catch (error) {
    // Catch network or other unexpected errors
    console.error('Error during login:', error);
    alert('An error occurred. Please try again.');
  }
});
