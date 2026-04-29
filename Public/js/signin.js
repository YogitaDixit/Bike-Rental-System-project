document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    
    const password = document.getElementById('password').value;

    
// Check if the password is at least 8 characters long
if (password.length < 8) {
    alert('Password must be at least 8 characters long.');
    return; // Stop further execution
}

    const loginData = {
        email: email,
        password: password
    };

    // Send the login data to the server
    fetch('/api/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            alert('Sign In successful!');
          
            // Optionally redirect to another page after successful login
            window.location.href = 'index1.html';
        } else {
            alert('Sign In failed. Please check your email and password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});

