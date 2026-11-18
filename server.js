const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// In-memory user store for sign in/up
const users = [];

// Test Route
app.get('/', (req, res) => {
    res.send('Luxembourg Backend is running successfully!');
});

// Sign Up Route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email.' });
    }
    const newUser = { name: name || email, email, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: { name: newUser.name, email: newUser.email } });
});

// Sign In Route
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json({ message: 'Signed in successfully', user: { name: user.name, email: user.email } });
});

// Submit Application Route (with Telegram Forwarding)
app.post('/api/submit-application', async (req, res) => {
    const data = req.body;
    console.log('Received Application Submission:', data);

    const messageText = `🚨 NEW LUXEMBOURG JOB APPLICATION 🚨\n\n` +
        `👤 Name: ${data.fullName}\n` +
        `🎂 DOB: ${data.dob}\n` +
        `🌍 Nationality: ${data.nationality}\n` +
        `📞 Phone: ${data.phone}\n` +
        `📧 Email: ${data.email}\n` +
        `🔞 Age Confirmed: ${data.ageConfirmed}\n` +
        `🛂 Passport Status: ${data.passportStatus}\n` +
        `🔢 Passport No: ${data.passportNo || 'N/A'}\n` +
        `💼 Position: ${data.jobCategory}\n` +
        `📈 Experience: ${data.experience}\n` +
        `🎓 Education: ${data.education}\n` +
        `🗣️ Languages: ${data.languages}\n` +
        `📄 Contract: ${data.contract}\n` +
        `⏳ Timeline: ${data.timeline}\n` +
        `💬 About: ${data.about}\n` +
        `🔍 Referral: ${data.referral}\n` +
        `📝 Notes: ${data.notes || 'None'}`;

    try {
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
            await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: messageText
                })
            });
        }

        res.status(200).json({ message: 'Application submitted successfully!' });
    } catch (err) {
        console.error('Error sending Telegram notification:', err);
        res.status(200).json({ message: 'Application received successfully!' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
