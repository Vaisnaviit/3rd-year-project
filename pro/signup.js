// document.getElementById('login-form').addEventListener('submit', async (event) => {
//     event.preventDefault();
  
//     const email = event.target.email.value;
//     const password = event.target.password.value;
  
//     // Prepare data for the backend
//     const response = await fetch('/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
  
//     if (response.ok) {
//       // Handle successful login
//       window.location.href = 'projectccc.html';
//     } else {
//       alert('Login failed. Please check your credentials.');
//     }
//   });
  
// Get the form element
const signupForm = document.getElementById('signup-form');

// Add an event listener to handle form submission
signupForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Capture user inputs
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  // Prepare the data to send to the backend
  const userData = { name, email, password };

  try {
    // Send the data to the backend
    const response = await fetch("http://localhost:3000/signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify(userData), // Convert the data to a JSON string
    });

    // Handle the server's response
    if (response.ok) {
      alert('Sign up successful!');
      window.location.href = 'login.html'; // Redirect to login page
    } else {
      const errorMessage = await response.text();
      alert(`Sign up failed: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error during sign up:', error);
    alert('An error occurred. Please try again later.');
  }
});
