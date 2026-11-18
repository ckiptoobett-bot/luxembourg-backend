const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS so your GitHub Pages frontend can communicate with Render
app.use(cors());
app.use(express.json());

// Root health check route
app.get('/', (req, res) => {
    res.json({ status: "Luxembourg Jobs API is running" });
});

// Temporary in-memory user store (or plug in your MongoDB connection/schemas here)
const users = [];

// Sign Up Route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    users.push({ name: name || 'User', email, password });
    return res.status(201).json({ message: 'User registered successfully' });
});

// Sign In Route
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({ 
        message: 'Signed in successfully',
        user: { name: user.name, email: user.email }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
