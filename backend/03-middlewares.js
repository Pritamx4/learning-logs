// ============================================
// MIDDLEWARES - Sabse Important Concept
// ============================================

// Middleware kya hai?
// => Koi bhi function jo request aur response ke beech me chalti hai
// => Request aane ke baad aur response bhejne se pehle jo kaam hote hai
// => Jaise security check, logging, authentication etc.

// Middleware ka structure:
// function(req, res, next) {
//     // kuch kaam karo
//     next(); // agle middleware/route ko call karo
// }

const express = require('express');
const app = express();
const PORT = 3002;

// ============================================
// 1. SIMPLE MIDDLEWARE - Logging
// ============================================

// Ye middleware har request pe chalega
// Ye batayega ki kon sa URL hit hua aur kaunsa method use hua
const loggerMiddleware = (req, res, next) => {
    console.log(`📝 [${new Date().toLocaleTimeString()}] ${req.method} request => ${req.url}`);
    // next() call karna zaroori hai warna request aage nahi jayegi
    next();
};

// app.use() se middleware ko globally register karte hai
// Matlab har route pe ye middleware pehle chalega
app.use(loggerMiddleware);

// ============================================
// 2. AUTHENTICATION MIDDLEWARE
// ============================================

// Ye check karega ki user authenticated hai ya nahi
const authMiddleware = (req, res, next) => {
    // Maan lo query me token aa raha hai: /dashboard?token=abc123
    const token = req.query.token;
    
    console.log('🔐 Checking authentication...');
    
    if (token === 'secret123') {
        console.log('✅ Authentication successful!');
        // Agar token sahi hai to aage jane do
        next();
    } else {
        console.log('❌ Authentication failed!');
        // Agar token galat hai to error bhejo aur aage mat jane do
        res.status(401).send('⛔ Unauthorized! Token missing ya galat hai');
    }
};

// ============================================
// 3. TIME CHECKING MIDDLEWARE
// ============================================

// Ye middleware check karega ki time 9 AM se 6 PM ke beech hai ya nahi
const workingHoursMiddleware = (req, res, next) => {
    const hour = new Date().getHours();
    
    console.log(`⏰ Current hour: ${hour}`);
    
    if (hour >= 9 && hour < 18) {
        console.log('✅ Working hours me hai');
        next();
    } else {
        res.send('⛔ Sorry! Website sirf 9 AM se 6 PM tak khuli hai');
    }
};

// ============================================
// ROUTES WITH DIFFERENT MIDDLEWARES
// ============================================

// Public route - koi middleware nahi, sabke liye open
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome! 👋</h1>
        <p>Ye public page hai, koi bhi dekh sakta hai</p>
        <ul>
            <li><a href="/public">Public Page</a></li>
            <li><a href="/dashboard?token=secret123">Dashboard (Auth needed)</a></li>
            <li><a href="/admin?token=secret123">Admin (Auth + Working Hours check)</a></li>
            <li><a href="/profile/john">User Profile</a></li>
        </ul>
    `);
});

// Public route
app.get('/public', (req, res) => {
    res.send('📖 Ye public content hai, sabko dikh sakta hai');
});

// Protected route - auth middleware lagaya
// Sirf wo log access kar sakte hai jinke paas token hai
app.get('/dashboard', authMiddleware, (req, res) => {
    res.send('🎯 Dashboard! Sirf authenticated users hi yeha aa sakte hai');
});

// Multiple middlewares ek saath - pehle auth check, phir time check
app.get('/admin', authMiddleware, workingHoursMiddleware, (req, res) => {
    res.send('👑 Admin Panel - Sirf authenticated users aur working hours me access hoga');
});

// ============================================
// 4. CUSTOM MIDDLEWARE - USER INFO ADD KARNA
// ============================================

// Ye middleware request me custom data add kar dega
const addUserInfo = (req, res, next) => {
    // req object me apna custom data add kar sakte ho
    req.userInfo = {
        username: 'Sai',
        role: 'admin',
        id: 123
    };
    console.log('ℹ️ User info added to request');
    next();
};

app.get('/profile/:name', addUserInfo, (req, res) => {
    // req.userInfo middleware ne add kiya tha
    res.json({
        message: 'Profile Page',
        urlParam: req.params.name,
        userFromMiddleware: req.userInfo
    });
});

// ============================================
// 5. ERROR HANDLING MIDDLEWARE
// ============================================

// Error handling middleware - last me likhna hota hai
// Ye middleware 4 parameters leta hai (err, req, res, next)
app.use((err, req, res, next) => {
    console.error('❌ Error hua:', err.message);
    res.status(500).json({
        error: true,
        message: 'Kuch galat ho gaya!'
    });
});

// ============================================
// 6. MIDDLEWARE FOR SPECIFIC METHOD
// ============================================

// Sirf POST requests ke liye middleware
app.post('/submit', (req, res, next) => {
    console.log('📬 POST request aaya submit route pe');
    next();
}, (req, res) => {
    res.send('Data submit ho gaya!');
});

// ============================================
// 7. BUILT-IN MIDDLEWARES (Express ke saath aati hai)
// ============================================

// Static files serve karne ke liye (HTML, CSS, images etc)
// app.use(express.static('public'));

// JSON parse karne ke liye
app.use(express.json());

// URL-encoded data parse karne ke liye
app.use(express.urlencoded({ extended: true }));

// ============================================
// 8. THIRD-PARTY MIDDLEWARES (npm se install karni padti hai)
// ============================================

// Examples (install karna padega):
// const cors = require('cors'); // Cross-origin requests allow karne ke liye
// app.use(cors());

// const morgan = require('morgan'); // Advanced logging ke liye
// app.use(morgan('dev'));

// const helmet = require('helmet'); // Security ke liye
// app.use(helmet());

// ============================================
// 9. CONDITIONAL MIDDLEWARE - Kuch routes pe hi lagana
// ============================================

// Specific routes ko group kar sakte ho
const specialRoutes = express.Router();

// Ye middleware sirf /api routes pe hi lagega
specialRoutes.use((req, res, next) => {
    console.log('🔧 Special API middleware');
    next();
});

specialRoutes.get('/users', (req, res) => {
    res.json({ message: 'Users list' });
});

specialRoutes.get('/products', (req, res) => {
    res.json({ message: 'Products list' });
});

// Router ko /api prefix ke saath mount karte hai
app.use('/api', specialRoutes);

// ============================================
// 10. MIDDLEWARE CHAIN EXAMPLE
// ============================================

// Multiple middlewares ek ke baad ek chalenge
app.get('/chain-demo',
    (req, res, next) => {
        console.log('1️⃣ First middleware');
        next();
    },
    (req, res, next) => {
        console.log('2️⃣ Second middleware');
        next();
    },
    (req, res, next) => {
        console.log('3️⃣ Third middleware');
        next();
    },
    (req, res) => {
        console.log('4️⃣ Final route handler');
        res.send('Dekho terminal me - teen middlewares aur ek final handler chale!');
    }
);

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Server running: http://localhost:${PORT}`);
    console.log(`\n🧪 Test karne ke liye:`);
    console.log(`   - Public: http://localhost:${PORT}/public`);
    console.log(`   - Dashboard: http://localhost:${PORT}/dashboard?token=secret123`);
    console.log(`   - Admin: http://localhost:${PORT}/admin?token=secret123`);
    console.log(`   - API: http://localhost:${PORT}/api/users`);
    console.log(`   - Chain: http://localhost:${PORT}/chain-demo`);
});

// ============================================
// MIDDLEWARE KEY POINTS:
// ============================================
// 1. Middleware request aur response ke beech me chalti hai
// 2. next() call karna zaroori hai warna request hang ho jayegi
// 3. app.use() se global middleware lagta hai (har route pe)
// 4. Specific route me bhi middleware laga sakte ho
// 5. Multiple middlewares chain me laga sakte ho
// 6. Order important hai - jo pehle likha wo pehle chalega
// 7. Error handling middleware last me likhni chahiye
// 8. Middleware me req aur res object ko modify kar sakte ho

// COMMON USE CASES:
// - Logging (har request ka record)
// - Authentication (user logged in hai ya nahi)
// - Authorization (user ko permission hai ya nahi)
// - Validation (data sahi hai ya nahi)
// - Error handling
// - CORS handling
// - Request body parsing
// - Static files serving
