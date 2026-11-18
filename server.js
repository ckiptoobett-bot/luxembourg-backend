const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS so your GitHub frontend can talk to this backend
app.use(cors());
app.use(express.json());

// In-memory storage for users and applications (or update with your database logic if you use one)
const users = [];
const applications = [];

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

// Submit Application Route
app.post('/api/submit-application', (req, res) => {
    const applicationData = req.body;
    console.log('Received Application:', applicationData);
    
    applications.push({
        ...applicationData,
        submittedAt: new Date().toISOString()
    });

    // Here you can also add your email/telegram forwarding logic if desired!

    res.status(200).json({ message: 'Application received successfully!' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
