# Email Configuration Setup

## Quick Setup Instructions

The contact form now sends emails to a configured recipient address. Follow these steps to set it up:

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Configure Environment Variables**

Edit the `.env` file in your project root:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password
RECIPIENT_EMAIL=wagagisacco@gmail.com
PORT=3000
```

#### Getting Gmail Credentials:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" (if not already enabled)
3. Go to "App passwords" (appears after 2FA is enabled)
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Paste it in `.env` as `EMAIL_PASSWORD`

### 3. **Set the Recipient Email**

Change `RECIPIENT_EMAIL` in `.env` to the email where you want to receive messages:
```
RECIPIENT_EMAIL=your-email@gmail.com
```

### 4. **Run the Server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 5. **Test the Form**

1. Open `http://localhost:3000` in your browser
2. Fill out the contact form
3. Check your configured email address for the submission

## How It Works

- **Form Submission**: User fills out the contact form and clicks "Send Message"
- **Backend Processing**: Node.js/Express server receives the form data
- **Email to SACCO**: Email sent to the configured `RECIPIENT_EMAIL` address
- **Confirmation Email**: Automatic confirmation email sent to the user's email address
- **User Feedback**: User sees a success message

## Email Templates

### Email to SACCO
Contains: Sender name, email, message, and sender's email for reply

### Confirmation to User
Contains: Thank you message and their submitted message for reference

## Troubleshooting

- **"Failed to send email"**: Check your Gmail credentials and 2FA setup
- **Port 3000 in use**: Change `PORT` in `.env` to another port (e.g., 3001)
- **Messages not received**: Check spam/trash folder and verify RECIPIENT_EMAIL

## Security Notes

- Never commit `.env` file to version control
- Use app-specific passwords (not your main Gmail password)
- Consider using environment variables on your hosting provider
