// ============================================
// EXPRESS BASICS - Shuru se samajhte hai
// ============================================

// ham express isliye use krte hai ki hame apis create karni hoti hai apne localhost port pe
// jaise '/home-page', '/about', '/login' etc.
// Express ek framework hai jo Node.js ke upar bana hai jo server banane ko easy karta hai

// Step 1: Express ko install karna hoga pehle
// Terminal me type karo: npm install express

// Step 2: Express ko import karte hai
const express = require('express');

// Step 3: Express ka ek instance banate hai (isse app kahte hai)
const app = express();

// Step 4: Port number define karte hai jaha server run hoga
// Jaise localhost:3000 pe server chalega
const PORT = 3000;

// ============================================
// BASIC ROUTES BANATE HAI
// ============================================

// GET request - jab browser me URL type karte ho tab ye use hota hai
// '/' matlab home page, jab sirf localhost:3000 likho
app.get('/', (req, res) => {
    // req = request (client se aaya data)
    // res = response (hum client ko kya bhejenge)
    res.send('Hello! Welcome to Express Server 🚀');
});

// '/home-page' route - jab localhost:3000/home-page type karo
app.get('/home-page', (req, res) => {
    res.send('Ye home page hai!');
});

// '/about' route
app.get('/about', (req, res) => {
    res.send('Ye about page hai - yaha apni details likho');
});

// JSON data bhejna - APIs me mostly JSON format me data jaata hai
app.get('/api/user', (req, res) => {
    // JSON object bhej rahe hai
    res.json({
        name: 'Pritam',
        age: 21,
        city: 'Rewari'
    });
});

// URL Parameters - dynamic routes banane ke liye
// :id matlab ye dynamic hai, koi bhi value aa sakti hai
app.get('/user/:id', (req, res) => {
    // req.params se URL me jo value aati hai wo mil jaati hai
    const userId = req.params.id;
    res.send(`User ki ID hai: ${userId}`);
});

// Multiple parameters bhi le sakte ho
app.get('/product/:category/:id', (req, res) => {
    res.json({
        category: req.params.category,
        productId: req.params.id
    });
});

// Query Parameters - URL me ? ke baad jo data aata hai
// Example: localhost:3000/search?name=laptop&price=50000
app.get('/search', (req, res) => {
    // req.query se query parameters milte hai
    console.log(req.query); // { name: 'laptop', price: '50000' }
    res.send(`Searching for: ${req.query.name} with price: ${req.query.price}`);
});

// POST request - jab data submit karna ho (form submit, login etc)
app.post('/submit', (req, res) => {
    res.send('Data submit ho gaya!');
});

// PUT request - jab existing data update karna ho
app.put('/update/:id', (req, res) => {
    res.send(`ID ${req.params.id} ka data update ho gaya`);
});

// DELETE request - data delete karne ke liye
app.delete('/delete/:id', (req, res) => {
    res.send(`ID ${req.params.id} delete ho gaya`);
});

// ============================================
// SERVER START KARTE HAI
// ============================================

// listen() function se server start hota hai
// PORT number aur ek callback function dete hai
app.listen(PORT, () => {
    console.log(`🚀 Server chal gaya hai port ${PORT} pe`);
    console.log(`Browser me jao: http://localhost:${PORT}`);
});

// ============================================
// KYA HAI ES FILE ME:
// ============================================
// 1. Express ko import kiya
// 2. Express ka instance banaya (app)
// 3. Different routes banaye (GET, POST, PUT, DELETE)
// 4. URL parameters aur query parameters samjhe
// 5. Server ko specific port pe start kiya

// FILE CHALANE KE LIYE:
// Terminal me type karo: node 01-express-basics.js
