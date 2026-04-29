// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
const Booking = require('../models/Booking');
const router = express.Router();
const {v4: uuidv4}= require('uuid');
const {setUser}= require('../service/auth');
const {getUser}= require('../service/auth')



// Sign Up route
router.post('/signup', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            bookings: [] // Initialize the bookings array
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});


// Sign In Route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body; // Get email and password from the request body
      
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
       
        // If authentication is successful, send a success response
        const sessionId= uuidv4();
        setUser(sessionId,user);
        res.cookie("uid", sessionId);
        res.status(200).json({ message: 'Sign In successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST route to create a new booking using email
router.post('/bookings', async (req, res) => {
    
    const userUid =req.cookies.uid;
         if(!userUid) return res.redirect("/signin");
        const user = getUser(userUid);
        
        const userId = user._id;
    const {  bikeName, price, startDate, endDate } = req.body;
    
    
    try {
        const newBooking = new Booking({  bikeName, price, startDate, endDate, userId});
        const savedBooking = await newBooking.save();

        const user = await User.findOne({ _id: userId });  
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Add the booking to user's bookings array 
        user.bookings.push(savedBooking._id);
        await user.save();

        res.json({ success: true, message: 'Booking saved successfully', booking: savedBooking });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ success: false, message: 'Error saving booking', error });
    }
});

// route for finding all bookings for logged in user

router.get('/bookings', async (req, res) => {
    const userUid = req.cookies.uid;
    if (!userUid) return res.redirect("/signin");

    const user = getUser(userUid);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized user' });
    }

    try {
        // Find all bookings for the logged-in user
        const bookings = await Booking.find({ userId: user._id });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
});

router.delete('/bookings/:id', async (req, res) => {
    const bookingId = req.params.id;
    try {
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);
        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ success: false, message: 'Error canceling booking' });
    }
});



// Sign Out Route
router.post('/signout', (req, res) => {
    // Clear the 'uid' cookie
    res.clearCookie('uid');
    res.status(200).json({ success: true, message: 'Sign Out successful' });
});


module.exports=router;