
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import paymentRoute from './routes/paymentRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes

app.get('/', (req, res) => {
    res.send('CV Builder API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/cv', resumeRoutes);
app.use('/api/download-cv', paymentRoute);

// Connect DB and start server

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB', err);
    });
