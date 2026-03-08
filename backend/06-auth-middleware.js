// ============================================
// AUTHENTICATION MIDDLEWARE - User ko verify karna
// ============================================

// Authentication kya hai?
// => User ko verify karna ki wo kaun hai (login check karna)
// => Ye check karna ki user ka password sahi hai ya nahi
// => Secure routes banane ke liye zaroori hai

// Authorization kya hai?
// => User ko permission check karna ki wo kya kar sakta hai
// => Example: Admin panel sirf admin dekh sakta hai, normal user nahi

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3004;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ============================================
// DUMMY DATABASE - Real me ye database me hoga
// ============================================

// Users ka fake database
const users = [
    {
        id: 1,
        username: 'admin',
        password: '12345', // Real me password encrypted hona chahiye (bcrypt use karo)
        role: 'admin',
        email: 'admin@example.com'
    },
    {
        id: 2,
        username: 'sai',
        password: 'pass123',
        role: 'user',
        email: 'sai@example.com'
    },
    {
        id: 3,
        username: 'rahul',
        password: 'rahul456',
        role: 'user',
        email: 'rahul@example.com'
    }
];

// Currently logged in users (session storage)
// Real application me ye Redis ya database me hoga
const activeSessions = {};

// ============================================
// 1. BASIC AUTHENTICATION MIDDLEWARE
// ============================================

// Ye middleware check karega ki user logged in hai ya nahi
const isAuthenticated = (req, res, next) => {
    console.log('🔐 Checking authentication...');
    
    // Cookie se session ID nikalo
    const sessionId = req.cookies.sessionId;
    
    if (sessionId && activeSessions[sessionId]) {
        // User logged in hai
        console.log('✅ User authenticated:', activeSessions[sessionId].username);
        
        // req object me user info add kar do (baad me use kar sakte ho)
        req.user = activeSessions[sessionId];
        next(); // Aage jane do
    } else {
        // User logged in nahi hai
        console.log('❌ Authentication failed - No session found');
        res.status(401).send(`
            <h2>⛔ Unauthorized Access</h2>
            <p>Please <a href="/login">login</a> to access this page</p>
        `);
    }
};

// ============================================
// 2. ROLE-BASED AUTHORIZATION MIDDLEWARE
// ============================================

// Ye middleware check karega ki user ka role sahi hai ya nahi
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        console.log(`🔍 Checking role: Required=${requiredRole}, User=${req.user?.role}`);
        
        // Pehle check karo user logged in hai ya nahi
        if (!req.user) {
            return res.status(401).send(`
                <h2>⛔ Unauthorized</h2>
                <p>Please <a href="/login">login</a> first</p>
            `);
        }
        
        // Ab role check karo
        if (req.user.role === requiredRole) {
            console.log('✅ Role verified');
            next(); // Aage jane do
        } else {
            console.log('❌ Insufficient permissions');
            res.status(403).send(`
                <h2>⛔ Forbidden</h2>
                <p>You don't have permission to access this page</p>
                <p>Your role: <strong>${req.user.role}</strong></p>
                <p>Required role: <strong>${requiredRole}</strong></p>
                <a href="/dashboard">Go back to Dashboard</a>
            `);
        }
    };
};

// Multiple roles accept karne wala middleware
const requireAnyRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(`🔍 Checking roles: Allowed=[${allowedRoles}], User=${req.user?.role}`);
        
        if (!req.user) {
            return res.status(401).send('⛔ Please login first');
        }
        
        if (allowedRoles.includes(req.user.role)) {
            console.log('✅ Role verified');
            next();
        } else {
            res.status(403).send(`
                <h2>⛔ Access Denied</h2>
                <p>Required roles: ${allowedRoles.join(', ')}</p>
            `);
        }
    };
};

// ============================================
// 3. HOME PAGE - Public (koi bhi dekh sakta hai)
// ============================================

app.get('/', (req, res) => {
    const currentUser = req.cookies.sessionId && activeSessions[req.cookies.sessionId];
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Auth Middleware Demo</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .user-info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
                a { display: block; padding: 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; text-align: center; }
                a:hover { background: #0056b3; }
                .btn-danger { background: #dc3545; }
                .btn-danger:hover { background: #c82333; }
                .btn-success { background: #28a745; }
                .btn-success:hover { background: #218838; }
                .btn-warning { background: #ffc107; color: black; }
                .btn-warning:hover { background: #e0a800; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔐 Authentication Middleware Demo</h1>
                
                ${currentUser ? `
                    <div class="user-info">
                        <p>✅ Logged in as: <strong>${currentUser.username}</strong></p>
                        <p>📧 Email: ${currentUser.email}</p>
                        <p>👤 Role: <strong>${currentUser.role}</strong></p>
                    </div>
                ` : '<p>❌ Not logged in</p>'}
                
                <h3>📚 Available Pages:</h3>
                <div class="links">
                    <a href="/public">📖 Public Page</a>
                    <a href="/dashboard" class="btn-success">🎯 Dashboard (Login required)</a>
                    <a href="/profile" class="btn-success">👤 Profile (Login required)</a>
                    <a href="/admin" class="btn-warning">👑 Admin Panel (Admin only)</a>
                    ${currentUser ? 
                        '<a href="/logout" class="btn-danger">🚪 Logout</a>' : 
                        '<a href="/login" class="btn-success">🔑 Login</a>'
                    }
                </div>
                
                <hr style="margin: 30px 0;">
                
                <h3>📝 Test Accounts:</h3>
                <ul>
                    <li><strong>Admin:</strong> username: admin, password: 12345</li>
                    <li><strong>User:</strong> username: sai, password: pass123</li>
                    <li><strong>User:</strong> username: rahul, password: rahul456</li>
                </ul>
            </div>
        </body>
        </html>
    `);
});

// ============================================
// 4. LOGIN PAGE - Public
// ============================================

app.get('/login', (req, res) => {
    // Agar already logged in hai to dashboard pe bhej do
    if (req.cookies.sessionId && activeSessions[req.cookies.sessionId]) {
        return res.redirect('/dashboard');
    }
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login</title>
            <style>
                body { font-family: Arial; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                .login-box { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-width: 400px; width: 100%; }
                h2 { text-align: center; color: #333; margin-bottom: 30px; }
                input { width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 14px; }
                input:focus { outline: none; border-color: #667eea; }
                button { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 10px; }
                button:hover { opacity: 0.9; }
                .info { background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; }
                .error { background: #ffe6e6; color: #d32f2f; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <div class="login-box">
                <h2>🔐 Login</h2>
                ${req.query.error ? '<div class="error">❌ Invalid username or password!</div>' : ''}
                
                <form action="/login" method="POST">
                    <input type="text" name="username" placeholder="Username" required autofocus>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login 🚀</button>
                </form>
                
                <div class="info">
                    <strong>Test Accounts:</strong><br>
                    👑 Admin: admin / 12345<br>
                    👤 User: sai / pass123<br>
                    👤 User: rahul / rahul456
                </div>
            </div>
        </body>
        </html>
    `);
});

// ============================================
// 5. LOGIN HANDLER - Authentication Logic
// ============================================

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log(`🔑 Login attempt: ${username}`);
    
    // User ko database me dhundo
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Login successful!
        console.log(`✅ Login successful: ${username}`);
        
        // Session ID generate karo (random string)
        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36);
        
        // Session ko store karo
        activeSessions[sessionId] = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            loginTime: new Date()
        };
        
        // Session ID ko cookie me store karo
        res.cookie('sessionId', sessionId, {
            httpOnly: true, // XSS attack se bachata hai
            maxAge: 3600000 // 1 hour
        });
        
        // Dashboard pe redirect karo
        res.redirect('/dashboard');
    } else {
        // Login failed
        console.log(`❌ Login failed: ${username}`);
        res.redirect('/login?error=1');
    }
});

// ============================================
// 6. LOGOUT HANDLER
// ============================================

app.get('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;
    
    if (sessionId && activeSessions[sessionId]) {
        const username = activeSessions[sessionId].username;
        console.log(`👋 User logged out: ${username}`);
        
        // Session delete karo
        delete activeSessions[sessionId];
    }
    
    // Cookie clear karo
    res.clearCookie('sessionId');
    
    res.send(`
        <div style="text-align: center; padding: 50px; font-family: Arial;">
            <h2>👋 Logout Successful!</h2>
            <p>You have been logged out successfully</p>
            <a href="/" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to Home</a>
        </div>
    `);
});

// ============================================
// 7. PROTECTED ROUTES - Login Required
// ============================================

// Dashboard - sirf logged in users dekh sakte hai
app.get('/dashboard', isAuthenticated, (req, res) => {
    // req.user middleware ne add kiya hai
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dashboard</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                .info-card { background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
                .stat-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
                a { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
                a:hover { background: #0056b3; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎯 Dashboard</h1>
                
                <div class="info-card">
                    <h3>Welcome, ${req.user.username}! 👋</h3>
                    <p>📧 Email: ${req.user.email}</p>
                    <p>👤 Role: <strong>${req.user.role}</strong></p>
                    <p>🕐 Login Time: ${req.user.loginTime.toLocaleString()}</p>
                </div>
                
                <div class="stats">
                    <div class="stat-box">
                        <h2>🎯</h2>
                        <p>Welcome to<br>Dashboard</p>
                    </div>
                    <div class="stat-box">
                        <h2>✅</h2>
                        <p>You are<br>Authenticated</p>
                    </div>
                    <div class="stat-box">
                        <h2>${req.user.role === 'admin' ? '👑' : '👤'}</h2>
                        <p>Role:<br>${req.user.role}</p>
                    </div>
                </div>
                
                <h3>🔗 Quick Links:</h3>
                <a href="/profile">View Profile</a>
                ${req.user.role === 'admin' ? '<a href="/admin" style="background: #ffc107; color: black;">Admin Panel</a>' : ''}
                <a href="/">Home</a>
                <a href="/logout" style="background: #dc3545;">Logout</a>
            </div>
        </body>
        </html>
    `);
});

// Profile page - login required
app.get('/profile', isAuthenticated, (req, res) => {
    res.send(`
        <div style="font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2>👤 User Profile</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 10px; border-bottom: 1px solid #eee;"><strong>ID:</strong> ${req.user.id}</li>
                <li style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Username:</strong> ${req.user.username}</li>
                <li style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong> ${req.user.email}</li>
                <li style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Role:</strong> ${req.user.role}</li>
                <li style="padding: 10px;"><strong>Login Time:</strong> ${req.user.loginTime.toLocaleString()}</li>
            </ul>
            <a href="/dashboard" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Back to Dashboard</a>
        </div>
    `);
});

// ============================================
// 8. ADMIN-ONLY ROUTES - Role-based Access
// ============================================

// Admin panel - sirf admin role wale dekh sakte hai
app.get('/admin', isAuthenticated, requireRole('admin'), (req, res) => {
    // Yaha tak pohochne ke liye:
    // 1. User logged in hona chahiye (isAuthenticated)
    // 2. User ka role 'admin' hona chahiye (requireRole('admin'))
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Panel</title>
            <style>
                body { font-family: Arial; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
                .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background: #667eea; color: white; }
                .badge { padding: 5px 10px; border-radius: 20px; font-size: 12px; }
                .badge-admin { background: #ffc107; color: black; }
                .badge-user { background: #28a745; color: white; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>👑 Admin Panel</h1>
                <p>Welcome to admin panel, <strong>${req.user.username}</strong>!</p>
                
                <h2>👥 All Users:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                            <tr>
                                <td>${u.id}</td>
                                <td>${u.username}</td>
                                <td>${u.email}</td>
                                <td><span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}">${u.role}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <h2>🔌 Active Sessions:</h2>
                <p>Currently logged in users: <strong>${Object.keys(activeSessions).length}</strong></p>
                <ul>
                    ${Object.entries(activeSessions).map(([sessionId, user]) => `
                        <li>${user.username} (${user.role}) - Logged in at ${user.loginTime.toLocaleTimeString()}</li>
                    `).join('')}
                </ul>
                
                <a href="/dashboard" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Back to Dashboard</a>
            </div>
        </body>
        </html>
    `);
});

// API endpoint - admin only (JSON response)
app.get('/api/users', isAuthenticated, requireRole('admin'), (req, res) => {
    res.json({
        success: true,
        data: users.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role
        }))
    });
});

// ============================================
// 9. PUBLIC ROUTE - Koi bhi dekh sakta hai
// ============================================

app.get('/public', (req, res) => {
    res.send(`
        <div style="font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2>📖 Public Page</h2>
            <p>Ye page sabke liye open hai, kisi bhi authentication ki zarurat nahi</p>
            <p>Logged in ho ya nahi, koi farak nahi padta</p>
            <a href="/" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go Home</a>
        </div>
    `);
});

// ============================================
// 10. API ENDPOINTS WITH AUTH
// ============================================

// Protected API - sirf authenticated users access kar sakte hai
app.get('/api/protected', isAuthenticated, (req, res) => {
    res.json({
        success: true,
        message: 'This is a protected API endpoint',
        user: {
            username: req.user.username,
            role: req.user.role
        }
    });
});

// Public API - koi bhi access kar sakta hai
app.get('/api/public', (req, res) => {
    res.json({
        success: true,
        message: 'This is a public API endpoint',
        timestamp: new Date()
    });
});

// ============================================
// 11. UTILITY ENDPOINTS
// ============================================

// Check current session
app.get('/api/session', (req, res) => {
    const sessionId = req.cookies.sessionId;
    
    if (sessionId && activeSessions[sessionId]) {
        res.json({
            authenticated: true,
            user: activeSessions[sessionId]
        });
    } else {
        res.json({
            authenticated: false,
            message: 'No active session'
        });
    }
});

// View all active sessions (admin only)
app.get('/api/sessions', isAuthenticated, requireRole('admin'), (req, res) => {
    res.json({
        success: true,
        totalSessions: Object.keys(activeSessions).length,
        sessions: Object.entries(activeSessions).map(([id, user]) => ({
            sessionId: id,
            username: user.username,
            role: user.role,
            loginTime: user.loginTime
        }))
    });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Server running: http://localhost:${PORT}`);
    console.log(`\n🔐 Authentication Middleware Demo:`);
    console.log(`   - Home: http://localhost:${PORT}`);
    console.log(`   - Login: http://localhost:${PORT}/login`);
    console.log(`   - Dashboard: http://localhost:${PORT}/dashboard (login required)`);
    console.log(`   - Admin Panel: http://localhost:${PORT}/admin (admin only)`);
    console.log(`\n👤 Test Accounts:`);
    console.log(`   - Admin: admin / 12345`);
    console.log(`   - User: sai / pass123`);
    console.log(`   - User: rahul / rahul456`);
});

// ============================================
// KEY CONCEPTS:
// ============================================
// 1. Authentication = User ko verify karna (login check)
// 2. Authorization = User ko permission check karna (role check)
// 3. Session = Server pe user ki info store karna
// 4. Cookie = Browser me session ID store karna
// 5. Middleware = Har request se pehle check karna

// AUTHENTICATION FLOW:
// 1. User login form me credentials dalega
// 2. Server credentials verify karega (database se match karega)
// 3. Agar sahi hai to session create karega
// 4. Session ID ko cookie me store karega
// 5. Har request me browser automatically cookie bhejega
// 6. Middleware cookie se session ID nikalega
// 7. Session ID se user info nikalega
// 8. User authenticated hai to aage jane dega

// MIDDLEWARE CHAIN:
// app.get('/route', middleware1, middleware2, middleware3, finalHandler)
// Agar koi middleware next() call nahi karta to chain ruk jaati hai

// SECURITY TIPS:
// 1. Password always encrypted store karo (bcrypt use karo)
// 2. Cookies me httpOnly flag lagao (XSS attack se bachata hai)
// 3. HTTPS use karo production me
// 4. Session expiry time set karo
// 5. CSRF token use karo forms me
// 6. Rate limiting lagao (brute force attack se bachane ke liye)

// NEXT LEVEL (Production Ready):
// 1. JWT (JSON Web Tokens) - Token-based authentication
// 2. OAuth - Google/Facebook login
// 3. 2FA (Two-Factor Authentication) - Extra security
// 4. Password hashing with bcrypt
// 5. Refresh tokens
// 6. Rate limiting
// 7. CSRF protection

// FILE CHALANE KE LIYE:
// node 06-auth-middleware.js
