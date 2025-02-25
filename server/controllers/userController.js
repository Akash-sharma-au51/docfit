const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required', success: false });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Generate token
        const token = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ 
            message: 'User created successfully', 
            success: true, 
            token: token 
        });

    } catch (err) {
        res.status(500).json({ 
            message: 'Error occurred while creating user', 
            success: false, 
            error: err.message 
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required', success: false });
    }

    try {
        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist', success: false });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

        // Generate token
        const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: `Welcome back ${user.name}`,
            success: true,
            token: token
        });

    } catch (err) {
        res.status(500).json({ 
            message: 'Error occurred during login', 
            success: false, 
            error: err.message 
        });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully', success: true });
};

module.exports = { registerUser, loginUser, logoutUser };
