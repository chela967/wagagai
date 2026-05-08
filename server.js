const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Serve the site root explicitly for Vercel / Express
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Email Configuration
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'wagagisacco@gmail.com'; // Change this to your email

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Handle contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate form data
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Email options to send to SACCO
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: RECIPIENT_EMAIL,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>Please reply to: ${email}</em></p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send confirmation email to user
        const confirmationEmail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'We received your message - Wagagai SACCO',
            html: `
                <h2>Thank you for contacting Wagagai SACCO</h2>
                <p>Hello ${name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Best regards,<br>Wagagai SACCO Team</p>
            `
        };

        await transporter.sendMail(confirmationEmail);

        res.status(200).json({ 
            success: true, 
            message: 'Your message has been sent successfully!' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.' 
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
