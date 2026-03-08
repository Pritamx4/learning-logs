// ============================================
// HTML FORM SE INPUT LENA (WITH SEPARATE HTML FILES)
// ============================================

// HTML form se data backend me kaise laaye aur use kaise kare
// Form data POST request me aata hai body me

// AB HUMNE HTML FILES KO ALAG SE BANAYA HAI:
// - public/index.html => Home page
// - public/registration.html => Registration form
// - public/login.html => Login form

const express = require('express');
const path = require('path'); // Path operations ke liye (file paths handle karne ke liye)
const app = express();
const PORT = 3001;

// ============================================
// IMPORTANT MIDDLEWARE - FORM DATA KE LIYE
// ============================================

// URL-encoded data parse karne ke liye (HTML form ka data)
// Ye middleware har request me pehle chalega aur form data ko req.body me daal dega
app.use(express.urlencoded({ extended: true }));

// JSON data parse karne ke liye (APIs se aane wala data)
app.use(express.json());

// ============================================
// STATIC FILES MIDDLEWARE - HTML, CSS, Images serve karne ke liye
// ============================================

// express.static() middleware se static files serve kar sakte ho
// 'public' folder me jo bhi files hai wo directly serve hongi
// Example: public/style.css => http://localhost:3001/style.css
// Example: public/index.html => http://localhost:3001/index.html

app.use(express.static(path.join(__dirname, 'public')));

// Ye line karti kya hai:
// 1. __dirname = current file ka directory path
// 2. path.join() = paths ko safely join karta hai
// 3. express.static() = folder ko static file server bana deta hai
// 4. Ab public folder ki saari files browser se access kar sakte ho

console.log('📁 Static files serving from:', path.join(__dirname, 'public'));

// ============================================
// HOME PAGE - Ab HTML file se serve ho raha hai
// ============================================

// Pehle humne HTML inline likha tha (res.send() me)
// Ab humne HTML files alag se banayi hai 'public' folder me
// express.static() middleware automatically serve karega

// Jab user '/' pe jaaye to index.html automatically serve hoga
// Ye express.static middleware ki wajah se possible hai

// ALTERNATE WAY - Agar specific file bhejna ho to:
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Lekin humne express.static() use kiya hai to direct index.html open hoga

// ============================================
// FORM DATA RECEIVE KARTE HAI (POST REQUEST)
// ============================================

// Jab form submit hoga to data yaha ayega
app.post('/submit', (req, res) => {
    // req.body me saara form data aa jaata hai
    // Ye isliye kaam karta hai kyuki humne upar express.urlencoded() middleware use kiya
    
    console.log('📦 Form se aaya data:', req.body);
    
    // Individual fields access kar sakte ho
    const { username, email, password, age, city } = req.body;
    
    // Data ko console me print karte hai
    console.log(`
        ✅ User Registration Details:
        👤 Name: ${username}
        📧 Email: ${email}
        🔒 Password: ${password}
        🎂 Age: ${age}
        🏙️  City: ${city}
    `);
    
    // Response bhejte hai
    res.send(`
        <h2>✅ Registration Successful!</h2>
        <p>Welcome <strong>${username}</strong>!</p>
        <p>Email: ${email}</p>
        <p>Age: ${age}</p>
        <p>City: ${city}</p>
        <br>
        <a href="/">👈 Go Back</a>
    `);
});

// ============================================
// LOGIN FORM - Ab static file se serve ho raha hai
// ============================================

// Login form bhi public/login.html me hai
// Browser me direct /login.html type karke access kar sakte ho
// Ya home page se link pe click karke bhi ja sakte ho

// ============================================
// LOGIN HANDLER - Form submit hone ke baad
// ============================================

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log(`🔐 Login attempt: ${username}`);
    
    // Simple validation (real me database se check karenge)
    if (username === 'admin' && password === '12345') {
        res.send(`<h2>✅ Login Successful!</h2><p>Welcome back, ${username}!</p>`);
    } else {
        res.send(`<h2>❌ Login Failed!</h2><p>Invalid credentials. <a href="/login">Try again</a></p>`);
    }
});

// ============================================
// JSON DATA BHEJNA (FOR APIs)
// ============================================

// Agar frontend se JSON format me data aa raha hai (React, Angular etc)
app.post('/api/register', (req, res) => {
    // req.body me JSON data aa jaata hai
    // Ye isliye kaam karta hai kyuki humne express.json() middleware use kiya
    
    console.log('📦 API se aaya JSON data:', req.body);
    
    // Response me bhi JSON bhejte hai
    res.json({
        success: true,
        message: 'Registration successful',
        data: req.body
    });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Server chal gaya: http://localhost:${PORT}`);
    console.log(`📄 Form dekhne ke liye: http://localhost:${PORT}`);
    console.log(`🔐 Login page: http://localhost:${PORT}/login`);
});

// ============================================
// KEY POINTS:
// ============================================
// 1. express.urlencoded() - HTML form data ke liye zaroori
// 2. express.json() - JSON data ke liye zaroori
// 3. req.body - form/JSON data yaha milta hai
// 4. Form me name attribute important hai (wohi req.body me key banega)
// 5. method="POST" - form data POST request se bhejta hai
// 6. action="/submit" - data kis route pe jayega

// TEST KARNE KE LIYE:
// 1. node 02-html-form-input.js
// 2. Browser me jao: http://localhost:3001
// 3. Form fill karo aur submit karo
// 4. Terminal me data print hota dikhega
\n📁 Available pages:`);
    console.log(`   🏠 Home: http://localhost:${PORT}`);
    console.log(`   📝 Registration: http://localhost:${PORT}/registration.html`);
    console.log(`   🔐 Login: http://localhost:${PORT}/login.html`);
    console.log(`\n💡 Tip: Terminal me form submissions ka data dikhega`);
});

// ============================================
// KEY CHANGES (KYA KIYA HUMNE):
// ============================================
// 
// PEHLE (Old way):
// - HTML code JavaScript file me inline tha (res.send() me)
// - Saara code ek hi file me mixed tha
// - HTML edit karne ke liye JS file open karni padti thi
// - Code messy aur hard to maintain tha
//
// AB (New way):
// - HTML files alag se 'public' folder me hai
// - express.static() middleware se serve ho rahi hai
// - HTML aur JavaScript code separate hai
// - Clean aur professional structure hai
// - HTML edit karna easy hai (separate file me)
//
// ============================================

// ============================================
// FOLDER STRUCTURE (KAISE ORGANIZE KIYA):
// ============================================
// 
// backend/
// ├── 02-html-form-input.js  (Main Express server)
// └── public/                (Static files folder)
//     ├── index.html         (Home page)
//     ├── registration.html  (Registration form)
//     └── login.html         (Login form)
//
// ============================================

// ============================================
// EXPRESS.STATIC() KYA KARTA HAI:
// ============================================
// 
// 1. Folder ko static file server bana deta hai
// 2. Folder ki saari files directly accessible ho jaati hai
// 3. HTML, CSS, JavaScript, images sab serve kar sakte ho
// 4. Automatic content-type detection (HTML ko HTML ki tarah serve karega)
// 5. Production me bhi yahi method use hota hai
//
// Example:
// public/style.css    => http://localhost:3001/style.css
// public/index.html   => http://localhost:3001/ or http://localhost:3001/index.html
// public/logo.png     => http://localhost:3001/logo.png
//
// ============================================

// ============================================
// KEY POINTS (YAAD RAKHNA):
// ============================================
// 
// 1. express.urlencoded() - HTML form data parse karne ke liye ZAROORI
// 2. express.json() - JSON API data parse karne ke liye
// 3. express.static() - Static files (HTML, CSS, images) serve karne ke liye
// 4. req.body - Form/JSON data yaha milta hai (middleware ke baad)
// 5. Form me name attribute IMPORTANT - wohi req.body me key banta hai
// 6. method="POST" - Form data POST request se bhejta hai (secure)
// 7. action="/submit" - Form data kis route pe jayega
// 8. path.join() - File paths ko safely join karta hai (OS independent)
// 9. __dirname - Current file ka directory path (automatic variable)
//
// ============================================

// ============================================
// BENEFITS OF SEPARATE HTML FILES:
// ============================================
// 
// ✅ Code organization - HTML aur JavaScript alag
// ✅ Easy to maintain - HTML edit karne ke liye PHP/JS touch nahi karna
// ✅ Team collaboration - Designer HTML pe, developer JS pe kaam kar sakta hai
// ✅ Reusability - HTML files ko other projects me bhi use kar sakte ho
// ✅ Better structure - Real-world projects me yahi structure use hota hai
// ✅ Performance - Static files browser cache kar sakta hai
// ✅ Scalability - Jaise project bada ho, proper structure se manage easy
//
// ============================================

// TEST KARNE KE LIYE:
// 1. Terminal me: node 02-html-form-input.js
// 2. Browser me jao: http://localhost:3001
// 3. Home page se forms access karo
// 4. Form fill karke submit karo
// 5. Terminal me data print hota dikhega
// 6. Browser me response message