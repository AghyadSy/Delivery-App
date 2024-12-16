const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/userModel'); // Adjust the path to match your project structure

const createAdmin = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');

        // Check if an admin already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin account already exists!');
            return;
        }

        // Hash the password
        const password = process.env.ADMIN_PASSWORD; // Ensure this is set in your .env file
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user
        const admin = new User({
            name: process.env.ADMIN_NAME || 'Admin',
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'Admin',
        });

        // Save the admin to the database
        await admin.save();
        console.log('Admin account created successfully!');
    } catch (error) {
        console.error('Error creating admin:', error.message);
    } finally {
        // Disconnect from the database
        mongoose.connection.close();
    }
};

// Run the function
createAdmin();
