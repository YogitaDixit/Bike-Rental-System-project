document.getElementById('name').addEventListener('input', function(event) {
    let nameInput = event.target.value;

    // Prevent numbers and special characters
    if (/[^a-zA-Z\s]/.test(nameInput)) { 
        alert('Only letters are allowed in the name field!');
        event.target.value = nameInput.replace(/[^a-zA-Z\s]/g, ''); // Remove invalid characters
    }

    // Limit name length to 40 characters
    if (nameInput.length > 40) {
        alert('Name cannot exceed 40 characters.');
        event.target.value = nameInput.slice(0, 40); // Trim input to 40 characters
    }
});

document.getElementById('phone').addEventListener('input', function(event) {
    let phoneInput = event.target.value;

    // Prevent input of non-numeric characters
    if (/\D/.test(phoneInput)) { 
        alert('Only numbers are allowed in the phone number field!');
        event.target.value = phoneInput.replace(/\D/g, ''); // Remove non-numeric characters
    }

    // Limit to 10 digits
    if (phoneInput.length > 10) {
        event.target.value = phoneInput.slice(0, 10); // Trim input to 10 digits
    }
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value; // Get the password
// Check if the password is at least 8 characters long
if (password.length < 8) {
    alert('Password must be at least 8 characters long.');
    return; // Stop further execution
}

// ✅ Phone number validation (Separate checks)
if (phone.length !== 10) {
    alert('Phone number must be exactly 10 digits.');
    return; // Stop form submission
}

    // Create an object to hold the data
    const userData = {
        name: name,
        email: email,
        phone: phone,
        password: password // Include the password in the object
    };

    // Send the data to your server
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            alert('Sign Up successful!');
            // Optionally redirect to another page
            window.location.href = 'sign-in.html';
        } else {
            alert('Sign Up failed. Please try again.');
        }
    })

    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});

