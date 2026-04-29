document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
});


function fetchBookings() {
    fetch('/api/bookings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(bookings => {
        const bookingsList = document.getElementById('bookings-list');
        bookingsList.innerHTML = '';  // Clear the previous list
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>No bookings found.</p>';
            return;
        }

        // Loop through each booking and display it
        bookings.forEach(booking => {
            const bookingSection = document.createElement('section');
            bookingSection.className = 'booking-item';
            bookingSection.innerHTML = `
                <h2>${booking.bikeName}</h2>
                <p>Price: ₹${booking.price} per day</p>
                <p>Start Date: ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p>End Date: ${new Date(booking.endDate).toLocaleDateString()}</p>
                <button class="btn cancel-booking" data-id="${booking._id}">Cancel Booking</button>
            `;
            bookingsList.appendChild(bookingSection);
        });

        // Add event listener to cancel booking buttons
        document.querySelectorAll('.cancel-booking').forEach(button => {
            button.addEventListener('click', function() {
                const bookingId = this.getAttribute('data-id');
                cancelBooking(bookingId);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching bookings:', error);
    });
}


function cancelBooking(bookingId) {
    fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message || 'Booking canceled successfully.');
            fetchBookings(); // Reload the list to reflect the deletion
        } else {
            alert('Failed to cancel booking. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error cancelling booking:', error);
        alert('An error occurred while cancelling the booking.');
    });
}


function signOut() {
    fetch('/api/signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Redirect to sign-in page or home page
            window.location.href = '/index.html';
        } else {
            alert('Failed to sign out. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error signing out:', error);
    });
}

