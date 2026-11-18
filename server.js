const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Luxembourg Backend (Telegram Bot) is running!');
});

// Submit Application Route
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
            const tgResponse = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: messageText
                })
            });
            const tgResult = await tgResponse.json();
            console.log('Telegram API Response:', tgResult);
        } else {
            console.log('Telegram Token or Chat ID is missing from environment variables.');
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
