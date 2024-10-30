const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS to only allow requests from your GitHub Pages URL
app.use(cors({
    origin: 'https://shivamchavan12.github.io' // Replace with your GitHub Pages URL
}));

app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // App password (use App Password if 2FA is enabled)
    }
});

// Endpoint to handle email sending
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New message from ${name}`,
        text: `Message from ${name} (${email}):\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error.message);
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.send('Email sent successfully!');
    });
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
