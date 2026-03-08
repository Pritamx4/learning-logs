# 🚀 Backend Basics Learning

Node.js aur Express ke basic concepts seekhne ke liye files.

## 📁 Files

1. **01-express-basics.js** - Express basics, routes, GET/POST/PUT/DELETE
2. **02-html-form-input.js** - HTML forms se data kaise le
3. **03-middlewares.js** - Middlewares kya hai aur kaise use kare
4. **04-cookie-parser.js** - Cookies set, get, delete karna
5. **05-file-system.js** - Files aur folders ke saath kaam (read, write, delete)
6. **06-auth-middleware.js** - Authentication & Authorization with role-based access
7. **07-router-middleware.js** - Router se routes organize karna, modular structure

## 🔧 Setup Kaise Kare

### Step 1: Dependencies Install Karo
```bash
cd backend
npm install
```

Ye install karega:
- express (server banane ke liye)
- cookie-parser (cookies ke liye)

### Step 2: Koi Bhi File Chalao

**Option 1: Direct run karo**
```bash
node 01-express-basics.js
node 02-html-form-input.js
node 03-middlewares.js
node 04-cookie-parser.js
node 05-file-system.js
node 06-auth-middleware.js
node 07-router-middleware.js
```

**Option 2: npm scripts use karo**
```bash
npm run express      # Express basics
npm run form         # Form input demo
npm run middleware   # Middlewares demo
npm run cookie       # Cookie parser demo
npm run fs           # File system demo
npm run auth         # Authentication demo
npm run router       # Router middleware demo
```

## 📖 Har File Me Kya Hai

### 1. Express Basics (Port 3000)
- Basic routes (`/`, `/home-page`, `/about`)
- GET, POST, PUT, DELETE methods
- URL parameters (`:id`)
- Query parameters (`?name=value`)
- JSON responses

**Chalao:** `npm run express`
**Browser:** http://localhost:3000

---

### 2. HTML Form Input (Port 3001)
- HTML form bhejna
- Form data receive karna
- POST request handle karna
- Login system example
- JSON API example

**Chalao:** `npm run form`
**Browser:** http://localhost:3001

---

### 3. Middlewares (Port 3002)
- Logging middleware
- Authentication middleware
- Time checking middleware
- Multiple middlewares chain
- Router groups
- Error handling

**Chalao:** `npm run middleware`
**Browser:** http://localhost:3002

---

### 4. Cookie Parser (Port 3003)
- Cookie set karna
- Cookie read karna
- Cookie delete karna
- Login system with cookies
- Signed cookies (secure)
- Cookie options (maxAge, httpOnly, secure)

**Chalao:** `npm run cookie`
**Browser:** http://localhost:3003

---

### 5. File System (No server - direct run)
- Files read/write/delete karna
- Folders create/delete karna
- File exists check karna
- File information nikalna
- Path operations
- Practical examples: TODO app, User data storage

**Chalao:** `npm run fs`
**Output:** Terminal me hi sab dikhega

---

### 6. Authentication Middleware (Port 3004)
- Login/Logout system
- Session management with cookies
- Protected routes (login required)
- Role-based authorization (admin vs user)
- Authentication vs Authorization
- Real-world examples: Dashboard, Admin Panel

**Chalao:** `npm run auth`
**Browser:** http://localhost:3004

---

### 7. Router Middleware (Port 3005)
- Routes ko organize karna (modular structure)
- Express Router ka use
- Router-specific middleware
- Nested routers (router ke andar router)
- Param middleware (URL parameters handle)
- route() method (multiple HTTP methods)
- Real-world project structure

**Chalao:** `npm run router`
**Browser:** http://localhost:3005

## 🎯 Learning Order (Sequence me seekho)

1. ✅ Pehle **01-express-basics.js** - Express ki neev samjho
2. ✅ Phir **02-html-form-input.js** - Form data kaise handle kare
3. ✅ Uske baad **03-middlewares.js** - Middlewares ka power samjho
4. ✅ Phir **04-cookie-parser.js** - Cookies se session manage karo
5. ✅ Uske baad **05-file-system.js** - Files aur folders handle karna seekho
6. ✅ Phir **06-auth-middleware.js** - Login/logout aur secure routes banao
7. ✅ Last me **07-router-middleware.js** - Routes ko organize karke professional structure banao

## 💡 Tips

- Har file me **Hindi/Hinglish comments** hai samajhne ke liye
- **Console** me output dekhte raho (terminal me)
- **Browser** me test karo har route ko
- Code me changes karke **experiment** karo
- Agar kuch samajh nahi aaye to comments padho

## ⚠️ Important Notes

1. Ek time pe ek hi file chalao (different ports hai)
2. Server band karne ke liye: `Ctrl + C`
3. Code change karne ke baad server restart karna padega
4. Browser me cookies dekhne ke liye: F12 > Application > Cookies

## 🔥 Next Steps

In concepts ke baad aage ye seekh sakte ho:
- **EJS/Pug** - Template engines
- **MongoDB/MySQL** - Database
- **JWT** - JSON Web Tokens (better auth)
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Sessions** - Server-side sessions
- **Validation** - Input validation libraries

## 📞 Problems?

Agar kuch problem aaye to:
1. Check karo ki `npm install` kiya hai ya nahi
2. Port already use me to nahi (change kar lo file me)
3. Syntax errors check karo
4. Console/terminal me errors padho

Happy Learning! 🎉
