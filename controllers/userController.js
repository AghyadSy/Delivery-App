const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please log in.',
            });
        }

        // Check if this is the first user in the database
        const isFirstUser = (await User.countDocuments({})) === 0;

        // Assign role based on whether it's the first user
        const role = isFirstUser ? 'Admin' : 'Customer';

        // Create the new user
        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: `User registered successfully as ${role}!`,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: error.message,
        });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Ensure the requester is an admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only admins can perform this action.',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'Admin',
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Admin created successfully!',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create admin. Please try again.',
            error: error.message,
        });
    }
};

module.exports = { registerUser, loginUser ,createAdmin };
