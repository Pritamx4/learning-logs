// ============================================
// ROUTER MIDDLEWARE - Routes ko organize karna
// ============================================

// Router kya hai?
// => Express ka ek feature jo routes ko organize karne me madad karta hai
// => Jab application badi ho jaati hai to saare routes ek file me nahi likh sakte
// => Router se routes ko alag alag modules me divide kar sakte ho
// => Har module ka apna middleware bhi ho sakta hai

// Router ke fayde:
// 1. Code organized aur clean rehta hai
// 2. Routes ko logical groups me divide kar sakte ho
// 3. Har router ka apna middleware ho sakta hai
// 4. Code reusable ban jaata hai
// 5. Team work easy ho jaati hai (alag alag files pe kaam kar sakte ho)

const express = require('express');
const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 1. BASIC ROUTER - Simple Example
// ============================================

// Router instance banao
const userRouter = express.Router();

// Router pe routes define karo (normal routes ki tarah hi)
userRouter.get('/', (req, res) => {
    res.json({
        message: 'Users list',
        users: ['Sai', 'Rahul', 'Priya']
    });
});

userRouter.get('/:id', (req, res) => {
    res.json({
        message: 'User details',
        userId: req.params.id
    });
});

userRouter.post('/', (req, res) => {
    res.json({
        message: 'User created',
        data: req.body
    });
});

// Router ko mount karo (prefix ke saath)
// Ab /users pe jaane se userRouter chalega
app.use('/users', userRouter);

// ============================================
// 2. ROUTER WITH MIDDLEWARE - Specific routes ke liye
// ============================================

// Products router banate hai with logging middleware
const productRouter = express.Router();

// Ye middleware sirf productRouter ke routes pe chalega
productRouter.use((req, res, next) => {
    console.log(`📦 Product Router: ${req.method} ${req.url}`);
    console.log(`   Time: ${new Date().toLocaleTimeString()}`);
    next();
});

productRouter.get('/', (req, res) => {
    res.json({
        message: 'All products',
        products: [
            { id: 1, name: 'Laptop', price: 50000 },
            { id: 2, name: 'Phone', price: 25000 },
            { id: 3, name: 'Tablet', price: 15000 }
        ]
    });
});

productRouter.get('/:id', (req, res) => {
    res.json({
        message: 'Product details',
        productId: req.params.id
    });
});

productRouter.post('/', (req, res) => {
    res.json({
        message: 'Product created',
        data: req.body
    });
});

app.use('/products', productRouter);

// ============================================
// 3. NESTED ROUTERS - Router ke andar router
// ============================================

// Admin router with nested sub-routers
const adminRouter = express.Router();

// Admin authentication middleware
adminRouter.use((req, res, next) => {
    console.log('🔐 Admin router - checking authentication...');
    // Real me ye proper auth check hoga
    const isAdmin = req.query.admin === 'true';
    if (isAdmin) {
        next();
    } else {
        res.status(403).json({
            error: 'Admin access required',
            hint: 'Add ?admin=true to the URL for demo'
        });
    }
});

// Admin dashboard
adminRouter.get('/', (req, res) => {
    res.json({
        message: 'Admin Dashboard',
        stats: {
            totalUsers: 150,
            totalProducts: 45,
            totalOrders: 320
        }
    });
});

// Nested router - Admin Users management
const adminUsersRouter = express.Router();

adminUsersRouter.get('/', (req, res) => {
    res.json({
        message: 'Admin - All users',
        users: [
            { id: 1, name: 'Sai', role: 'admin' },
            { id: 2, name: 'Rahul', role: 'user' },
            { id: 3, name: 'Priya', role: 'user' }
        ]
    });
});

adminUsersRouter.delete('/:id', (req, res) => {
    res.json({
        message: 'User deleted',
        userId: req.params.id
    });
});

// Nested router ko mount karo
adminRouter.use('/users', adminUsersRouter);

// Nested router - Admin Products management
const adminProductsRouter = express.Router();

adminProductsRouter.get('/', (req, res) => {
    res.json({
        message: 'Admin - All products with management options'
    });
});

adminProductsRouter.put('/:id', (req, res) => {
    res.json({
        message: 'Product updated',
        productId: req.params.id,
        data: req.body
    });
});

adminProductsRouter.delete('/:id', (req, res) => {
    res.json({
        message: 'Product deleted',
        productId: req.params.id
    });
});

adminRouter.use('/products', adminProductsRouter);

// Main admin router ko mount karo
app.use('/admin', adminRouter);

// ============================================
// 4. ROUTER WITH MULTIPLE MIDDLEWARES
// ============================================

const apiRouter = express.Router();

// Middleware 1 - Logging
const apiLogger = (req, res, next) => {
    console.log(`📡 API Call: ${req.method} ${req.originalUrl}`);
    next();
};

// Middleware 2 - API Key validation
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === 'secret-key-123') {
        console.log('✅ Valid API key');
        next();
    } else {
        res.status(401).json({
            error: 'Invalid API key',
            hint: 'Add header: x-api-key: secret-key-123'
        });
    }
};

// Middleware 3 - Rate limiting check (dummy)
const rateLimiter = (req, res, next) => {
    console.log('✅ Rate limit OK');
    next();
};

// Apply multiple middlewares to router
apiRouter.use(apiLogger);
apiRouter.use(validateApiKey);
apiRouter.use(rateLimiter);

// API routes
apiRouter.get('/data', (req, res) => {
    res.json({
        message: 'Protected API data',
        data: { value: 'Secret information' }
    });
});

apiRouter.post('/submit', (req, res) => {
    res.json({
        message: 'Data received',
        received: req.body
    });
});

app.use('/api/v1', apiRouter);

// ============================================
// 5. ROUTER PARAM MIDDLEWARE - URL parameters handle karna
// ============================================

const blogRouter = express.Router();

// param() middleware - specific parameter ke liye
// Jab bhi :postId parameter aayega, ye middleware pehle chalega
blogRouter.param('postId', (req, res, next, postId) => {
    console.log(`🔍 Checking post ID: ${postId}`);
    
    // Dummy database check
    const validPosts = ['1', '2', '3', '4', '5'];
    
    if (validPosts.includes(postId)) {
        // req object me post info add kar do
        req.post = {
            id: postId,
            title: `Blog Post ${postId}`,
            author: 'Sai',
            content: 'Lorem ipsum dolor sit amet...'
        };
        next();
    } else {
        res.status(404).json({
            error: 'Post not found',
            validIds: validPosts
        });
    }
});

// Ab har route me req.post available hai
blogRouter.get('/posts/:postId', (req, res) => {
    res.json({
        message: 'Blog post details',
        post: req.post // param middleware ne add kiya
    });
});

blogRouter.put('/posts/:postId', (req, res) => {
    res.json({
        message: 'Post updated',
        post: req.post,
        newData: req.body
    });
});

blogRouter.delete('/posts/:postId', (req, res) => {
    res.json({
        message: 'Post deleted',
        deletedPost: req.post
    });
});

app.use('/blog', blogRouter);

// ============================================
// 6. MODULAR ROUTER EXAMPLE - Real-world structure
// ============================================

// Auth routes module
const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
    res.json({
        message: 'Login successful',
        token: 'fake-jwt-token-123'
    });
});

authRouter.post('/register', (req, res) => {
    res.json({
        message: 'User registered',
        user: req.body
    });
});

authRouter.post('/logout', (req, res) => {
    res.json({
        message: 'Logged out successfully'
    });
});

app.use('/auth', authRouter);

// ============================================
// 7. ROUTER WITH DIFFERENT HTTP METHODS - route() method
// ============================================

const orderRouter = express.Router();

// route() method se ek hi path ke liye multiple methods define kar sakte ho
orderRouter.route('/')
    .get((req, res) => {
        res.json({
            message: 'Get all orders',
            orders: []
        });
    })
    .post((req, res) => {
        res.json({
            message: 'Create new order',
            order: req.body
        });
    });

orderRouter.route('/:id')
    .get((req, res) => {
        res.json({
            message: 'Get specific order',
            orderId: req.params.id
        });
    })
    .put((req, res) => {
        res.json({
            message: 'Update order',
            orderId: req.params.id
        });
    })
    .delete((req, res) => {
        res.json({
            message: 'Delete order',
            orderId: req.params.id
        });
    });

app.use('/orders', orderRouter);

// ============================================
// 8. ROUTER WITH ERROR HANDLING
// ============================================

const paymentRouter = express.Router();

paymentRouter.get('/process', (req, res, next) => {
    // Simulate error
    const randomError = Math.random() > 0.5;
    
    if (randomError) {
        // Error ko next() me pass karo
        const error = new Error('Payment processing failed');
        error.status = 500;
        next(error);
    } else {
        res.json({
            message: 'Payment successful',
            transactionId: 'TXN' + Date.now()
        });
    }
});

// Router-specific error handler
paymentRouter.use((err, req, res, next) => {
    console.error('💳 Payment error:', err.message);
    res.status(err.status || 500).json({
        error: 'Payment router error',
        message: err.message,
        hint: 'Try again - 50% chance of success'
    });
});

app.use('/payment', paymentRouter);

// ============================================
// 9. ROUTER FILE STRUCTURE EXAMPLE (Real Projects Me)
// ============================================

// Real project me alag files me hote hai:
/*
project/
├── routes/
│   ├── userRoutes.js       -> User related routes
│   ├── productRoutes.js    -> Product related routes
│   ├── authRoutes.js       -> Authentication routes
│   └── adminRoutes.js      -> Admin routes
├── middleware/
│   ├── auth.js             -> Authentication middleware
│   ├── validation.js       -> Input validation
│   └── errorHandler.js     -> Error handling
├── controllers/
│   ├── userController.js   -> User logic
│   └── productController.js -> Product logic
└── app.js                  -> Main file
*/

// Example: userRoutes.js file ka structure
// ==========================================
/*
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth.isAuthenticated, userController.getAllUsers);
router.get('/:id', auth.isAuthenticated, userController.getUserById);
router.post('/', auth.isAdmin, userController.createUser);
router.put('/:id', auth.isAuthenticated, userController.updateUser);
router.delete('/:id', auth.isAdmin, userController.deleteUser);

module.exports = router;
*/

// Main app.js me import karke use karte:
// ==========================================
/*
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
*/

// ============================================
// 10. HOME PAGE - All routes ki list
// ============================================

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Router Middleware Demo</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
                .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
                h1 { color: #333; margin-bottom: 20px; }
                h2 { color: #667eea; margin: 30px 0 15px; padding-bottom: 10px; border-bottom: 2px solid #667eea; }
                .route-section { margin: 20px 0; }
                .route { background: #f8f9fa; padding: 12px; margin: 8px 0; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; }
                .method { padding: 5px 12px; border-radius: 5px; color: white; font-weight: bold; font-size: 12px; margin-right: 10px; }
                .get { background: #28a745; }
                .post { background: #007bff; }
                .put { background: #ffc107; color: black; }
                .delete { background: #dc3545; }
                .path { flex: 1; font-family: 'Courier New', monospace; color: #333; }
                .desc { color: #666; font-size: 14px; }
                a { color: #667eea; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔄 Router Middleware Demo</h1>
                <p>Router se routes ko organized rakho aur modular structure banao</p>
                
                <h2>👥 User Routes (/users)</h2>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/users</span></div>
                        <div class="desc">All users</div>
                    </div>
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/users/:id</span></div>
                        <div class="desc">Specific user</div>
                    </div>
                    <div class="route">
                        <div><span class="method post">POST</span><span class="path">/users</span></div>
                        <div class="desc">Create user</div>
                    </div>
                </div>

                <h2>📦 Product Routes (/products) - With Logger Middleware</h2>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/products</span></div>
                        <div class="desc">All products</div>
                    </div>
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/products/:id</span></div>
                        <div class="desc">Product details</div>
                    </div>
                </div>

                <h2>👑 Admin Routes (/admin) - Nested Routers</h2>
                <div class="note">⚠️ Add <code>?admin=true</code> to access (demo purpose)</div>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/admin?admin=true</span></div>
                        <div class="desc">Dashboard</div>
                    </div>
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/admin/users?admin=true</span></div>
                        <div class="desc">User management</div>
                    </div>
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/admin/products?admin=true</span></div>
                        <div class="desc">Product management</div>
                    </div>
                </div>

                <h2>📡 API Routes (/api/v1) - Multiple Middlewares</h2>
                <div class="note">⚠️ Header required: <code>x-api-key: secret-key-123</code></div>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/api/v1/data</span></div>
                        <div class="desc">Protected data</div>
                    </div>
                    <div class="route">
                        <div><span class="method post">POST</span><span class="path">/api/v1/submit</span></div>
                        <div class="desc">Submit data</div>
                    </div>
                </div>

                <h2>📝 Blog Routes (/blog) - Param Middleware</h2>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/blog/posts/:postId</span></div>
                        <div class="desc">Post details (try 1-5)</div>
                    </div>
                    <div class="route">
                        <div><span class="method put">PUT</span><span class="path">/blog/posts/:postId</span></div>
                        <div class="desc">Update post</div>
                    </div>
                </div>

                <h2>🔐 Auth Routes (/auth)</h2>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method post">POST</span><span class="path">/auth/login</span></div>
                        <div class="desc">User login</div>
                    </div>
                    <div class="route">
                        <div><span class="method post">POST</span><span class="path">/auth/register</span></div>
                        <div class="desc">User registration</div>
                    </div>
                </div>

                <h2>🛒 Order Routes (/orders) - route() Method</h2>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/orders</span></div>
                        <div class="desc">All orders</div>
                    </div>
                    <div class="route">
                        <div><span class="method post">POST</span><span class="path">/orders</span></div>
                        <div class="desc">Create order</div>
                    </div>
                    <div class="route">
                        <div><span class="method put">PUT</span><span class="path">/orders/:id</span></div>
                        <div class="desc">Update order</div>
                    </div>
                </div>

                <h2>💳 Payment Routes (/payment) - Error Handling</h2>
                <div class="route-section">
                    <div class="route">
                        <div><span class="method get">GET</span><span class="path">/payment/process</span></div>
                        <div class="desc">Process payment (50% random error)</div>
                    </div>
                </div>

                <div style="margin-top: 40px; padding: 20px; background: #e7f3ff; border-radius: 10px;">
                    <h3>💡 Testing Tips:</h3>
                    <ul style="margin: 10px 0 0 20px; line-height: 1.8;">
                        <li>Use <strong>Postman</strong> or <strong>Thunder Client</strong> for testing POST/PUT/DELETE</li>
                        <li>Browser works for GET requests</li>
                        <li>Terminal me logs dekhte raho (middleware activity)</li>
                        <li>API routes ke liye header add karna mat bhoolna</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
    `);
});

// ============================================
// GLOBAL ERROR HANDLER - Last me
// ============================================

app.use((err, req, res, next) => {
    console.error('❌ Global error:', err.message);
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// ============================================
// 404 HANDLER - When no route matches
// ============================================

app.use((req, res) => {
    res.status(404).json({
        error: '404 Not Found',
        message: `Cannot ${req.method} ${req.url}`,
        hint: 'Check the home page for available routes'
    });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Server running: http://localhost:${PORT}`);
    console.log(`\n🔄 Router Middleware Examples:`);
    console.log(`   - Home: http://localhost:${PORT}`);
    console.log(`   - Users: http://localhost:${PORT}/users`);
    console.log(`   - Products: http://localhost:${PORT}/products`);
    console.log(`   - Admin: http://localhost:${PORT}/admin?admin=true`);
    console.log(`   - Blog: http://localhost:${PORT}/blog/posts/1`);
    console.log(`   - API: http://localhost:${PORT}/api/v1/data (needs API key)`);
    console.log(`\n📝 Note: Terminal me middleware logs dekhte raho!`);
});

// ============================================
// KEY CONCEPTS:
// ============================================
// 1. Router = Mini application jo routes ko group karta hai
// 2. app.use('/prefix', router) = Router ko mount karna
// 3. Har router ka apna middleware ho sakta hai
// 4. Nested routers = Router ke andar router
// 5. router.param() = URL parameters handle karne ke liye
// 6. router.route() = Same path ke liye multiple methods
// 7. Modular structure = Code organized aur maintainable

// ROUTER KE FAYDE:
// 1. Code organization aur readability
// 2. Reusability (same router multiple places)
// 3. Team collaboration (alag files pe kaam)
// 4. Middleware isolation (specific routes ke liye)
// 5. Testing easy ho jaata hai
// 6. Scalability (application grow kar sakti hai easily)

// REAL PROJECT STRUCTURE:
// - routes/ folder me saare route files
// - middleware/ folder me custom middlewares
// - controllers/ folder me business logic
// - models/ folder me database models
// - Main app.js me sab import karke mount karo

// BEST PRACTICES:
// 1. Logical grouping - related routes ek saath
// 2. Consistent naming - userRouter, productRouter etc
// 3. Middleware order matters - specific se general
// 4. Error handling har router me
// 5. Documentation - comments zaroor likho
// 6. Versioning - /api/v1, /api/v2 etc

// FILE CHALANE KE LIYE:
// node 07-router-middleware.js
