require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes');  // Import user routes
//const bookingRoutes = require('./routes/Bookings'); // Import booking routes


const app = express();
const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI;
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.static('Public')); // Serve static files from the frontend directory



// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Use user routes
app.use('/api', userRoutes);  // Use the user routes with a '/api' prefix

// Use booking routes
//app.use('/api/bookings', bookingRoutes); // Mount booking routes under '/api/bookings'

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
