// ============================================
// FILE SYSTEM (FS) - Files aur Folders ke saath kaam
// ============================================

// File System module kya hai?
// => Node.js me files aur folders ke saath kaam karne ke liye built-in module hai
// => Read, write, delete, rename - sab kuch kar sakte ho
// => Database ki jagah chhoti applications me files use kar sakte ho

// Do tarah ke methods hai:
// 1. Synchronous (sync) - code wait karega jab tak operation complete na ho
// 2. Asynchronous (async) - code aage chal jayega, operation background me hoga

const fs = require('fs'); // File system module (built-in hai, install nahi karna)
const path = require('path'); // Path operations ke liye (built-in)

// ============================================
// 1. FILE WRITE KARNA (Create/Overwrite)
// ============================================

// Synchronous way - code wait karega
function writeFileSync() {
    console.log('📝 File write kar rahe hai (sync)...');
    
    try {
        // writeFileSync(filename, content) - file create/overwrite karta hai
        fs.writeFileSync('test.txt', 'Hello! Ye meri pehli file hai 🎉');
        console.log('✅ File successfully create ho gayi!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Asynchronous way - code wait nahi karega, callback function chalega jab complete ho
function writeFileAsync() {
    console.log('📝 File write kar rahe hai (async)...');
    
    // writeFile(filename, content, callback)
    fs.writeFile('async-test.txt', 'Ye async tarike se bani hai', (error) => {
        if (error) {
            console.error('❌ Error:', error.message);
        } else {
            console.log('✅ Async file create ho gayi!');
        }
    });
    
    console.log('➡️ Ye line pehle print hogi! (async hai na)');
}

// Modern way - Promises ke saath (async/await use kar sakte ho)
const fsPromises = require('fs').promises;

async function writeFileModern() {
    console.log('📝 File write kar rahe hai (promise way)...');
    
    try {
        await fsPromises.writeFile('modern-test.txt', 'Modern async/await tarika! 🚀');
        console.log('✅ Modern file create ho gayi!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ============================================
// 2. FILE READ KARNA
// ============================================

// Synchronous - saara content ek saath mil jata hai
function readFileSync() {
    console.log('\n📖 File read kar rahe hai (sync)...');
    
    try {
        // readFileSync(filename, encoding) - encoding dena zaroori hai warna buffer milega
        const content = fs.readFileSync('test.txt', 'utf8');
        console.log('📄 File ka content:', content);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Asynchronous
function readFileAsync() {
    console.log('\n📖 File read kar rahe hai (async)...');
    
    fs.readFile('async-test.txt', 'utf8', (error, content) => {
        if (error) {
            console.error('❌ Error:', error.message);
        } else {
            console.log('📄 File ka content:', content);
        }
    });
}

// Modern async/await way
async function readFileModern() {
    console.log('\n📖 File read kar rahe hai (modern way)...');
    
    try {
        const content = await fsPromises.readFile('modern-test.txt', 'utf8');
        console.log('📄 File ka content:', content);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ============================================
// 3. FILE ME DATA ADD KARNA (Append)
// ============================================

// Append - file ke end me data add hota hai, overwrite nahi hota
function appendToFile() {
    console.log('\n➕ File me data append kar rahe hai...');
    
    try {
        // Pehle kuch content likho
        fs.writeFileSync('notes.txt', 'Line 1: Pehla note\n');
        
        // Ab append karo - naya data end me add hoga
        fs.appendFileSync('notes.txt', 'Line 2: Dusra note\n');
        fs.appendFileSync('notes.txt', 'Line 3: Teesra note\n');
        
        console.log('✅ Data append ho gaya!');
        
        // File padh ke dekho
        const content = fs.readFileSync('notes.txt', 'utf8');
        console.log('📄 Final content:\n', content);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ============================================
// 4. FILE DELETE KARNA
// ============================================

function deleteFile() {
    console.log('\n🗑️ File delete kar rahe hai...');
    
    try {
        // unlinkSync(filename) - file delete karta hai
        fs.unlinkSync('test.txt');
        console.log('✅ File delete ho gayi!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ============================================
// 5. FILE RENAME/MOVE KARNA
// ============================================

function renameFile() {
    console.log('\n✏️ File rename kar rahe hai...');
    
    try {
        // Pehle file banao
        fs.writeFileSync('old-name.txt', 'Ye purana naam hai');
        
        // renameSync(oldPath, newPath) - file ka naam change ya move karo
        fs.renameSync('old-name.txt', 'new-name.txt');
        
        console.log('✅ File rename ho gayi: old-name.txt → new-name.txt');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ============================================
// 6. FILE EXISTS CHECK KARNA
// ============================================

function checkFileExists() {
    console.log('\n🔍 File exist karti hai ya nahi check kar rahe hai...');
    
    // existsSync(path) - true/false return karta hai
    const exists1 = fs.existsSync('new-name.txt');
    const exists2 = fs.existsSync('non-existent.txt');
    
    console.log('✅ new-name.txt exists?', exists1);
    console.log('❌ non-existent.txt exists?', exists2);
}

// ============================================
// 7. FILE KI INFORMATION LENA (Stats)
// ============================================

function getFileStats() {
    console.log('\nℹ️ File ki information nikal rahe hai...');
    
    try {
        // Pehle file banao
        fs.writeFileSync('info-test.txt', 'File stats test');
        
        // statSync(filename) - file ki details milti hai
        const stats = fs.statSync('info-test.txt');
        
        console.log('📊 File Stats:');
        console.log('   - Size:', stats.size, 'bytes');
        console.log('   - Created:', stats.birthtime);
        console.log('   - Modified:', stats.mtime);
        console.log('   - Is File?', stats.isFile());
        console.log('   - Is Directory?', stats.isDirectory());
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ============================================
// 8. FOLDER/DIRECTORY OPERATIONS
// ============================================

// Folder create karna
function createDirectory() {
    console.log('\n📁 Folder create kar rahe hai...');
    
    try {
        // mkdirSync(path) - folder create karta hai
        fs.mkdirSync('my-folder');
        console.log('✅ Folder "my-folder" create ho gaya!');
        
        // Nested folders create karne ke liye recursive option
        fs.mkdirSync('parent/child/grandchild', { recursive: true });
        console.log('✅ Nested folders create ho gaye!');
    } catch (error) {
        // Agar folder already exist karta hai to error nahi dena
        if (error.code === 'EEXIST') {
            console.log('ℹ️ Folder already exist karta hai');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

// Folder ki files list karna
function listDirectory() {
    console.log('\n📋 Folder me kya kya hai dekh rahe hai...');
    
    try {
        // Pehle kuch files banao folder me
        fs.writeFileSync('my-folder/file1.txt', 'File 1');
        fs.writeFileSync('my-folder/file2.txt', 'File 2');
        fs.writeFileSync('my-folder/file3.txt', 'File 3');
        
        // readdirSync(path) - folder ki saari files/folders ka array return karta hai
        const files = fs.readdirSync('my-folder');
        
        console.log('📂 my-folder me ye files hai:');
        files.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file}`);
        });
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Folder delete karna
function deleteDirectory() {
    console.log('\n🗑️ Folder delete kar rahe hai...');
    
    try {
        // Empty folder delete karne ke liye
        // fs.rmdirSync('empty-folder');
        
        // Folder aur uski saari files delete karne ke liye (recursive)
        fs.rmSync('my-folder', { recursive: true, force: true });
        console.log('✅ Folder aur uski saari files delete ho gayi!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ============================================
// 9. PATH MODULE - Path operations
// ============================================

function pathOperations() {
    console.log('\n🛤️ Path operations...');
    
    // path.join() - paths ko safely join karta hai
    const fullPath = path.join('folder', 'subfolder', 'file.txt');
    console.log('Joined path:', fullPath);
    
    // path.basename() - file ka naam
    console.log('File name:', path.basename(fullPath));
    
    // path.dirname() - folder ka naam
    console.log('Directory:', path.dirname(fullPath));
    
    // path.extname() - file extension
    console.log('Extension:', path.extname(fullPath));
    
    // __dirname - current file ka directory path
    console.log('Current directory:', __dirname);
    
    // __filename - current file ka full path
    console.log('Current file:', __filename);
}

// ============================================
// 10. PRACTICAL EXAMPLE - Simple TODO App (File me save hoga)
// ============================================

class FileTodoApp {
    constructor() {
        this.filename = 'todos.json';
        // Agar file exist nahi karti to empty array se shuru karo
        if (!fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, '[]');
        }
    }
    
    // Saare todos read karo
    getTodos() {
        const data = fs.readFileSync(this.filename, 'utf8');
        return JSON.parse(data);
    }
    
    // Todos ko file me save karo
    saveTodos(todos) {
        fs.writeFileSync(this.filename, JSON.stringify(todos, null, 2));
    }
    
    // Naya todo add karo
    addTodo(text) {
        const todos = this.getTodos();
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todos.push(newTodo);
        this.saveTodos(todos);
        console.log('✅ Todo added:', text);
    }
    
    // Saare todos display karo
    listTodos() {
        const todos = this.getTodos();
        console.log('\n📝 TODO List:');
        if (todos.length === 0) {
            console.log('   (Koi todos nahi hai)');
        } else {
            todos.forEach((todo, index) => {
                const status = todo.completed ? '✅' : '⬜';
                console.log(`   ${status} ${index + 1}. ${todo.text}`);
            });
        }
    }
    
    // Todo complete mark karo
    completeTodo(index) {
        const todos = this.getTodos();
        if (index >= 0 && index < todos.length) {
            todos[index].completed = true;
            this.saveTodos(todos);
            console.log('✅ Todo completed!');
        }
    }
    
    // Todo delete karo
    deleteTodo(index) {
        const todos = this.getTodos();
        if (index >= 0 && index < todos.length) {
            const deleted = todos.splice(index, 1);
            this.saveTodos(todos);
            console.log('🗑️ Todo deleted:', deleted[0].text);
        }
    }
}

// ============================================
// 11. PRACTICAL EXAMPLE - User Data Storage
// ============================================

class UserDataManager {
    constructor() {
        this.folder = 'user-data';
        // User data ke liye folder banao
        if (!fs.existsSync(this.folder)) {
            fs.mkdirSync(this.folder);
        }
    }
    
    // User save karo
    saveUser(username, data) {
        const filepath = path.join(this.folder, `${username}.json`);
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        console.log(`✅ User "${username}" saved!`);
    }
    
    // User load karo
    getUser(username) {
        const filepath = path.join(this.folder, `${username}.json`);
        if (fs.existsSync(filepath)) {
            const data = fs.readFileSync(filepath, 'utf8');
            return JSON.parse(data);
        }
        return null;
    }
    
    // Saare users list karo
    listUsers() {
        const files = fs.readdirSync(this.folder);
        return files.map(file => path.basename(file, '.json'));
    }
    
    // User delete karo
    deleteUser(username) {
        const filepath = path.join(this.folder, `${username}.json`);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            console.log(`🗑️ User "${username}" deleted!`);
        }
    }
}

// ============================================
// SAB FUNCTIONS CHALATE HAI (DEMO)
// ============================================

async function runAllExamples() {
    console.log('🚀 File System Examples Start!\n');
    console.log('='.repeat(50));
    
    // Basic file operations
    writeFileSync();
    writeFileAsync();
    await writeFileModern();
    
    // Wait thoda - async operations complete hone do
    await new Promise(resolve => setTimeout(resolve, 100));
    
    readFileSync();
    readFileAsync();
    await readFileModern();
    
    appendToFile();
    renameFile();
    checkFileExists();
    getFileStats();
    
    // Directory operations
    createDirectory();
    listDirectory();
    
    // Path operations
    pathOperations();
    
    console.log('\n' + '='.repeat(50));
    console.log('📝 TODO App Demo:');
    console.log('='.repeat(50));
    
    // TODO App demo
    const todoApp = new FileTodoApp();
    todoApp.addTodo('Express seekhna hai');
    todoApp.addTodo('Middleware samajhna hai');
    todoApp.addTodo('Cookie parser practice karna hai');
    todoApp.listTodos();
    todoApp.completeTodo(0);
    todoApp.listTodos();
    
    console.log('\n' + '='.repeat(50));
    console.log('👤 User Data Manager Demo:');
    console.log('='.repeat(50));
    
    // User data manager demo
    const userManager = new UserDataManager();
    userManager.saveUser('sai', {
        email: 'sai@example.com',
        age: 25,
        city: 'Mumbai'
    });
    userManager.saveUser('rahul', {
        email: 'rahul@example.com',
        age: 28,
        city: 'Delhi'
    });
    
    console.log('\n👥 All users:', userManager.listUsers());
    console.log('\n📄 Sai ka data:', userManager.getUser('sai'));
    
    console.log('\n' + '='.repeat(50));
    console.log('🧹 Cleanup kar rahe hai...');
    
    // Cleanup - sab test files delete kar do
    deleteFile(); // test.txt already deleted
    try {
        fs.unlinkSync('async-test.txt');
        fs.unlinkSync('modern-test.txt');
        fs.unlinkSync('notes.txt');
        fs.unlinkSync('new-name.txt');
        fs.unlinkSync('info-test.txt');
        deleteDirectory(); // my-folder
        fs.rmSync('parent', { recursive: true, force: true });
        console.log('✅ Cleanup complete!');
    } catch (error) {
        // Ignore errors during cleanup
    }
    
    console.log('\n🎉 Examples complete! Check karo:');
    console.log('   - todos.json (TODO app data)');
    console.log('   - user-data/ folder (user files)');
}

// Main function run karo
runAllExamples();

// ============================================
// KEY POINTS:
// ============================================
// 1. fs module built-in hai, install nahi karna
// 2. Sync methods - code wait karega (simple but blocking)
// 3. Async methods - code wait nahi karega (efficient but callback hell)
// 4. Promises/async-await - modern aur clean way (best)
// 5. Always try-catch use karo error handling ke liye
// 6. File operations me path.join() use karo safely paths banane ke liye
// 7. Chhoti apps me database ki jagah files use kar sakte ho

// COMMON METHODS:
// - writeFileSync/writeFile - file create/overwrite
// - readFileSync/readFile - file read
// - appendFileSync/appendFile - file me add
// - unlinkSync/unlink - file delete
// - renameSync/rename - file rename/move
// - existsSync - file exist check
// - statSync/stat - file info
// - mkdirSync/mkdir - folder create
// - readdirSync/readdir - folder contents
// - rmSync/rm - folder delete (recursive)

// WHEN TO USE:
// - Configuration files save karna
// - Logs store karna
// - Simple data storage (JSON files)
// - File uploads handle karna
// - Reports generate karna
// - Backups banana

// FILE CHALANE KE LIYE:
// node 05-file-system.js
