import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { verifyGoogleToken } from '../utils/googleAuth.js';
import User from '../models/userModel.js';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, contact } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            contact,
            provider: 'local',
        });

        const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            token
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};


// Login (local)
export const loginUser = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            return res.status(400).json({ success: false, message: 'Email/Username and password are required.' });
        }

        let user = await User.findOne({ email: emailOrUsername }) || await User.findOne({ username: emailOrUsername });

        if (!user || user.provider !== 'local') {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};


// Google Login
export const googleLogin = async (req, res) => {
    try {
        const { token: googleToken } = req.body;

        if (!googleToken) {
            return res.status(400).json({ message: 'Google token is required.' });
        }

        const payload = await verifyGoogleToken(googleToken);
        if (!payload?.email || !payload?.sub) {
            return res.status(400).json({ message: 'Invalid Google token.' });
        }

        let user = await User.findOne({ 'social.googleId': payload.sub });

        if (!user) {
            user = await User.findOne({ email: payload.email });

            if (user) {
                // Link Google account to existing user
                user.social.googleId = payload.sub;
                user.provider = 'google';
                await user.save();
            } else {
                // Create new user
                user = await User.create({
                    username: payload.name || payload.email.split('@')[0],
                    email: payload.email,
                    password: '',
                    provider: 'google',
                    social: { googleId: payload.sub }
                });
            }
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Google login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error('Google Login Error:', err);
        res.status(500).json({ message: 'Server error during Google login' });
    }
};


// Get Current User
export const getUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                provider: user.provider,
                contact: user.contact || '',
                social: user.social || {},
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (err) {
        console.error('Get User Error:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching user' });
    }
};
