// ============================================
// COOKIE PARSER - Cookies ko samajhte hai
// ============================================

// Cookie kya hai?
// => Browser me store hone wala chhota sa data
// => Server browser ko cookie bhejta hai, browser use save kar leta hai
// => Agle request me browser automatically wo cookie wapas bhej deta hai
// => User ko track karne, session maintain karne ke liye use hoti hai

// Cookie Parser kyu chahiye?
// => Cookies ko read aur parse karne ke liye
// => Bina cookie-parser ke cookies access nahi kar sakte

const express = require('express');
// Cookie parser ko install karna padega pehle: npm install cookie-parser
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3003;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Cookie parser middleware use karte hai
// Ye middleware req.cookies object banata hai jisme saari cookies hoti hai
app.use(cookieParser());

// Form data ke liye
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================
// 1. COOKIE SET KARNA (bhejna)
// ============================================

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cookie Demo</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                a { display: inline-block; margin: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
                a:hover { background: #0056b3; }
                .btn { background: #28a745; padding: 10px 20px; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🍪 Cookie Management Demo</h1>
                <h3>Actions:</h3>
                <a href="/set-cookie">Set Cookie</a>
                <a href="/get-cookie">Get Cookie</a>
                <a href="/delete-cookie">Delete Cookie</a>
                <a href="/login-page">Login (with Cookie)</a>
                <a href="/check-login">Check Login Status</a>
            </div>
        </body>
        </html>
    `);
});

// Simple cookie set karte hai
app.get('/set-cookie', (req, res) => {
    // res.cookie(name, value, options) se cookie set hoti hai
    
    // Basic cookie
    res.cookie('username', 'Sai');
    res.cookie('age', '25');
    res.cookie('city', 'Mumbai');
    
    console.log('✅ Cookies set ho gayi');
    
    res.send(`
        <h2>✅ Cookies Set Ho Gayi!</h2>
        <p>Browser me cookies save ho gayi hai</p>
        <p>Ab <a href="/get-cookie">yaha click</a> karke dekho</p>
        <br>
        <a href="/">👈 Back to Home</a>
    `);
});

// ============================================
// 2. COOKIE READ KARNA
// ============================================

app.get('/get-cookie', (req, res) => {
    // req.cookies me saari cookies milti hai (cookie-parser ne parse karke di)
    console.log('📦 Saari cookies:', req.cookies);
    
    // Individual cookie access kar sakte ho
    const username = req.cookies.username;
    const age = req.cookies.age;
    const city = req.cookies.city;
    
    if (username) {
        res.send(`
            <h2>🍪 Cookies Mil Gayi!</h2>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>City:</strong> ${city}</p>
            <br>
            <a href="/">👈 Back to Home</a>
        `);
    } else {
        res.send(`
            <h2>❌ Koi Cookie Nahi Mili</h2>
            <p>Pehle <a href="/set-cookie">cookie set</a> karo</p>
        `);
    }
});

// ============================================
// 3. COOKIE DELETE KARNA
// ============================================

app.get('/delete-cookie', (req, res) => {
    // res.clearCookie(name) se cookie delete hoti hai
    res.clearCookie('username');
    res.clearCookie('age');
    res.clearCookie('city');
    
    console.log('🗑️ Cookies delete ho gayi');
    
    res.send(`
        <h2>🗑️ Cookies Delete Ho Gayi!</h2>
        <p>Sab cookies clear ho gayi</p>
        <p><a href="/get-cookie">Check karo</a> - koi cookie nahi milegi</p>
        <br>
        <a href="/">👈 Back to Home</a>
    `);
});

// ============================================
// 4. COOKIE OPTIONS - Advanced Settings
// ============================================

app.get('/set-advanced-cookie', (req, res) => {
    // Cookie options specify kar sakte ho
    
    // maxAge - cookie kitni der tak rahegi (milliseconds me)
    res.cookie('sessionId', 'abc123xyz', {
        maxAge: 60000 // 60 seconds
    });
    
    // expires - exact date/time specify karo
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    res.cookie('tempData', 'temporary', {
        expires: tomorrow
    });
    
    // httpOnly - JavaScript se access nahi hogi (security ke liye better)
    res.cookie('secureToken', 'secret789', {
        httpOnly: true,
        maxAge: 3600000 // 1 hour
    });
    
    // secure - sirf HTTPS pe hi bhejegi (production me use karo)
    res.cookie('vipData', 'important', {
        secure: false, // development me false, production me true
        httpOnly: true
    });
    
    console.log('✅ Advanced cookies set ho gayi');
    
    res.send(`
        <h2>✅ Advanced Cookies Set!</h2>
        <p>Different options ke saath cookies set ho gayi</p>
        <ul>
            <li>sessionId - 60 seconds me expire hogi</li>
            <li>tempData - kal tak rahegi</li>
            <li>secureToken - httpOnly (JavaScript access nahi kar sakta)</li>
        </ul>
        <a href="/">👈 Back</a>
    `);
});

// ============================================
// 5. PRACTICAL EXAMPLE - LOGIN SYSTEM WITH COOKIES
// ============================================

// Login page
app.get('/login-page', (req, res) => {
    // Pehle check karte hai ki user already logged in hai ya nahi
    if (req.cookies.loggedIn === 'true') {
        return res.send(`
            <h2>✅ Aap Already Logged In Ho!</h2>
            <p>Welcome back, <strong>${req.cookies.currentUser}</strong>!</p>
            <a href="/dashboard">Go to Dashboard</a>
            <a href="/logout">Logout</a>
        `);
    }
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #e9ecef; }
                .login-box { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
                button { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: #218838; }
            </style>
        </head>
        <body>
            <div class="login-box">
                <h2>🔐 Login</h2>
                <form action="/login" method="POST">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                <p style="text-align: center; margin-top: 20px;">
                    <small>Test credentials: admin / 12345</small>
                </p>
            </div>
        </body>
        </html>
    `);
});

// Login handler
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple validation (real me database se check karenge)
    if (username === 'admin' && password === '12345') {
        // Login successful - cookies set karte hai
        res.cookie('loggedIn', 'true', { 
            maxAge: 3600000, // 1 hour
            httpOnly: true 
        });
        res.cookie('currentUser', username, { 
            maxAge: 3600000 
        });
        res.cookie('loginTime', new Date().toLocaleString(), { 
            maxAge: 3600000 
        });
        
        console.log(`✅ User logged in: ${username}`);
        
        res.send(`
            <h2>✅ Login Successful!</h2>
            <p>Welcome, <strong>${username}</strong>!</p>
            <p>Cookies set ho gayi hai</p>
            <a href="/dashboard">Go to Dashboard</a>
        `);
    } else {
        res.send(`
            <h2>❌ Login Failed!</h2>
            <p>Invalid username or password</p>
            <a href="/login-page">Try Again</a>
        `);
    }
});

// Dashboard - protected page (cookie check karega)
app.get('/dashboard', (req, res) => {
    // Cookie check karte hai ki user logged in hai ya nahi
    if (req.cookies.loggedIn === 'true') {
        res.send(`
            <h2>🎯 Dashboard</h2>
            <p>Welcome back, <strong>${req.cookies.currentUser}</strong>!</p>
            <p>Login time: ${req.cookies.loginTime}</p>
            <p>Ye protected page hai, sirf logged in users dekh sakte hai</p>
            <br>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h2>⛔ Access Denied!</h2>
            <p>Please <a href="/login-page">login</a> first</p>
        `);
    }
});

// Logout
app.get('/logout', (req, res) => {
    // Saari login-related cookies delete kar do
    res.clearCookie('loggedIn');
    res.clearCookie('currentUser');
    res.clearCookie('loginTime');
    
    console.log('👋 User logged out');
    
    res.send(`
        <h2>👋 Logout Successful!</h2>
        <p>Aap successfully logout ho gaye</p>
        <a href="/login-page">Login Again</a>
        <br>
        <a href="/">Home</a>
    `);
});

// Check login status
app.get('/check-login', (req, res) => {
    if (req.cookies.loggedIn === 'true') {
        res.json({
            loggedIn: true,
            user: req.cookies.currentUser,
            loginTime: req.cookies.loginTime
        });
    } else {
        res.json({
            loggedIn: false,
            message: 'Not logged in'
        });
    }
});

// ============================================
// 6. SIGNED COOKIES - Extra Security
// ============================================

// Signed cookies ke liye secret key chahiye
// cookie-parser ko secret ke saath initialize karo
const secretKey = 'mera-secret-key-123';
app.use(cookieParser(secretKey));

app.get('/set-signed-cookie', (req, res) => {
    // signed: true option se cookie signed ho jaati hai
    // Cookie tamper nahi kar sakte client side se
    res.cookie('vipUser', 'premium-member', {
        signed: true, // Signed cookie
        httpOnly: true,
        maxAge: 3600000
    });
    
    res.send('🔒 Signed cookie set ho gayi (extra secure)');
});

app.get('/get-signed-cookie', (req, res) => {
    // Signed cookies req.signedCookies me milti hai
    console.log('Regular cookies:', req.cookies);
    console.log('Signed cookies:', req.signedCookies);
    
    const vipUser = req.signedCookies.vipUser;
    
    res.json({
        regularCookies: req.cookies,
        signedCookies: req.signedCookies,
        vipStatus: vipUser
    });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Server running: http://localhost:${PORT}`);
    console.log(`\n🍪 Cookie demos:`);
    console.log(`   - Home: http://localhost:${PORT}`);
    console.log(`   - Set Cookie: http://localhost:${PORT}/set-cookie`);
    console.log(`   - Get Cookie: http://localhost:${PORT}/get-cookie`);
    console.log(`   - Login Demo: http://localhost:${PORT}/login-page`);
    console.log(`\n⚠️  Note: Cookie-parser install karna mat bhoolna!`);
    console.log(`   Run: npm install cookie-parser`);
});

// ============================================
// COOKIE KEY POINTS:
// ============================================
// 1. cookie-parser middleware zaroori hai cookies use karne ke liye
// 2. res.cookie(name, value, options) se cookie set hoti hai
// 3. req.cookies me saari cookies milti hai
// 4. res.clearCookie(name) se cookie delete hoti hai
// 5. httpOnly: true lagao security ke liye (XSS attack se bachata hai)
// 6. maxAge ya expires se cookie ki life set karte hai
// 7. Signed cookies extra security deti hai (tampering se bachati hai)
// 8. Cookies automatically har request me browser bhejta hai

// COOKIE OPTIONS:
// - maxAge: kitni milliseconds tak cookie rahegi
// - expires: exact date tak cookie rahegi
// - httpOnly: JavaScript se access nahi hogi
// - secure: sirf HTTPS pe bhejegi
// - signed: cookie ko sign karegi (tampering detect kar sakenge)
// - path: kis path pe cookie available hai
// - domain: kis domain pe cookie bhejni hai

// COMMON USE CASES:
// - Session management (user logged in hai ya nahi)
// - User preferences store karna (theme, language etc)
// - Shopping cart data
// - Analytics tracking
// - Authentication tokens

// INSTALLATION:
// npm install express cookie-parser

// FILE CHALANE KE LIYE:
// node 04-cookie-parser.js
