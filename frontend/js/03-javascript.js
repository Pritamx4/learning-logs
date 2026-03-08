// ============================================
// JavaScript for 03-javascript-basics.html
// All interactive functionality
// ============================================

// ============================================
// 1. Data Types Demo
// ============================================
function showDataTypes() {
    let output = document.getElementById('dataTypeOutput');
    let result = '';
    
    // Different data types
    let name = "Sai";
    let age = 25;
    let isStudent = true;
    let hobbies = ["coding", "music"];
    let person = {name: "Rahul", age: 30};
    
    result += `String: "${name}" (${typeof name})\n`;
    result += `Number: ${age} (${typeof age})\n`;
    result += `Boolean: ${isStudent} (${typeof isStudent})\n`;
    result += `Array: [${hobbies}] (${typeof hobbies})\n`;
    result += `Object: {name: "${person.name}", age: ${person.age}} (${typeof person})`;
    
    output.textContent = result;
    console.log("Data Types Demo:", result);
}

// ============================================
// 2. Operators Demo
// ============================================
function demonstrateOperators() {
    let output = document.getElementById('operatorOutput');
    let result = '';
    
    // Arithmetic
    result += `10 + 3 = ${10 + 3}\n`;
    result += `10 - 3 = ${10 - 3}\n`;
    result += `10 * 3 = ${10 * 3}\n`;
    result += `10 / 3 = ${(10 / 3).toFixed(2)}\n`;
    result += `10 % 3 = ${10 % 3}\n\n`;
    
    // Comparison
    result += `10 == "10" is ${10 == "10"}\n`;
    result += `10 === "10" is ${10 === "10"}\n`;
    result += `10 > 5 is ${10 > 5}\n\n`;
    
    // Logical
    result += `true && true = ${true && true}\n`;
    result += `true || false = ${true || false}\n`;
    result += `!true = ${!true}`;
    
    output.textContent = result;
}

// ============================================
// 3. Age Check
// ============================================
function checkAge() {
    let age = document.getElementById('ageInput').value;
    let output = document.getElementById('ageOutput');
    age = parseInt(age);
    
    let result = '';
    
    if (age >= 18) {
        result = `Age ${age}: ✅ Adult - Vote kar sakte ho!`;
    } else {
        result = `Age ${age}: ❌ Minor - Abhi ${18 - age} saal aur wait karo`;
    }
    
    output.textContent = result;
}

// ============================================
// 4. Loops Demo
// ============================================
function demonstrateLoops() {
    let output = document.getElementById('loopOutput');
    let result = '';
    
    // For loop
    result += 'For Loop:\n';
    for (let i = 1; i <= 5; i++) {
        result += `  ${i}. Number ${i}\n`;
    }
    
    result += '\nArray Loop:\n';
    let fruits = ['Apple', 'Banana', 'Mango'];
    fruits.forEach((fruit, index) => {
        result += `  ${index + 1}. ${fruit}\n`;
    });
    
    output.textContent = result;
}

// ============================================
// 5. Function Examples
// ============================================
function calculateSum() {
    let num1 = parseInt(document.getElementById('num1').value);
    let num2 = parseInt(document.getElementById('num2').value);
    let output = document.getElementById('functionOutput');
    
    let sum = num1 + num2;
    output.textContent = `${num1} + ${num2} = ${sum}`;
}

function calculateProduct() {
    let num1 = parseInt(document.getElementById('num1').value);
    let num2 = parseInt(document.getElementById('num2').value);
    let output = document.getElementById('functionOutput');
    
    let product = num1 * num2;
    output.textContent = `${num1} × ${num2} = ${product}`;
}

// ============================================
// 6. Array Demo
// ============================================
function demonstrateArrays() {
    let output = document.getElementById('arrayOutput');
    let result = '';
    
    let numbers = [1, 2, 3, 4, 5];
    
    result += `Original: [${numbers}]\n\n`;
    
    // Map
    let doubled = numbers.map(n => n * 2);
    result += `Doubled: [${doubled}]\n`;
    
    // Filter
    let evens = numbers.filter(n => n % 2 === 0);
    result += `Evens: [${evens}]\n`;
    
    // Reduce
    let sum = numbers.reduce((total, n) => total + n, 0);
    result += `Sum: ${sum}\n`;
    
    output.textContent = result;
}

// ============================================
// 7. Object Demo
// ============================================
function demonstrateObjects() {
    let output = document.getElementById('objectOutput');
    
    let person = {
        name: "Sai",
        age: 25,
        city: "Mumbai",
        greet: function() {
            return `Hello, I'm ${this.name}`;
        }
    };
    
    let result = '';
    result += `Name: ${person.name}\n`;
    result += `Age: ${person.age}\n`;
    result += `City: ${person.city}\n`;
    result += `Greeting: ${person.greet()}\n\n`;
    result += `Keys: [${Object.keys(person).filter(k => typeof person[k] !== 'function')}]\n`;
    result += `Values: [${Object.values(person).filter(v => typeof v !== 'function')}]`;
    
    output.textContent = result;
}

// ============================================
// 8. DOM Manipulation Examples
// ============================================
function changeText() {
    document.getElementById('demoText').textContent = 'Text Changed! ✅';
}

function changeColor() {
    let element = document.getElementById('demoText');
    let colors = ['red', 'blue', 'green', 'purple', 'orange'];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    element.style.color = randomColor;
}

function toggleVisibility() {
    let element = document.getElementById('demoText');
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

// ============================================
// 9. EVENT LISTENERS - AUTO-ATTACHED
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Click Counter
    let clickCount = 0;
    document.getElementById('clickBtn').addEventListener('click', function() {
        clickCount++;
        document.getElementById('clickCount').textContent = `Clicks: ${clickCount}`;
    });
    
    // Keyboard Event
    document.getElementById('keyInput').addEventListener('input', function(e) {
        document.getElementById('keyOutput').textContent = `You typed: ${e.target.value}`;
    });
    
    // Mouse Events on Color Box
    let colorBox = document.getElementById('colorBox');
    let mouseOutput = document.getElementById('mouseOutput');
    
    colorBox.addEventListener('mouseenter', function() {
        this.style.background = '#e74c3c';
        this.textContent = 'Mouse Enter! 🎯';
        mouseOutput.textContent = 'Event: mouseenter';
    });
    
    colorBox.addEventListener('mouseleave', function() {
        this.style.background = '#3498db';
        this.textContent = 'Hover Me!';
        mouseOutput.textContent = 'Event: mouseleave';
    });
    
    colorBox.addEventListener('click', function() {
        this.style.background = '#2ecc71';
        this.textContent = 'Clicked! 👆';
        mouseOutput.textContent = 'Event: click';
    });
    
    // Live Input
    document.getElementById('liveInput').addEventListener('input', function(e) {
        document.getElementById('liveOutput').textContent = `Live: ${e.target.value}`;
    });
    
    // Change Event (Dropdown)
    document.getElementById('colorSelect').addEventListener('change', function(e) {
        let output = document.getElementById('selectOutput');
        output.textContent = `You selected: ${e.target.value}`;
        output.style.color = e.target.value;
    });
    
    // Multiple Events on Same Element
    let multiBox = document.getElementById('multiEventBox');
    let multiOutput = document.getElementById('multiOutput');
    
    multiBox.addEventListener('click', function() {
        multiOutput.textContent = '✅ Click event fired!';
    });
    
    multiBox.addEventListener('mouseenter', function() {
        this.style.background = '#e7f3ff';
        multiOutput.textContent = '🖱️ Mouse entered!';
    });
    
    multiBox.addEventListener('mouseleave', function() {
        this.style.background = 'white';
        multiOutput.textContent = '👋 Mouse left!';
    });
    
    multiBox.addEventListener('dblclick', function() {
        multiOutput.textContent = '🎯 Double clicked!';
        this.style.background = '#fff3e0';
    });
    
});

// ============================================
// 10. MINI PROJECTS
// ============================================

// Counter App
let counter = 0;

function incrementCounter() {
    counter++;
    document.getElementById('counterValue').textContent = counter;
}

function decrementCounter() {
    counter--;
    document.getElementById('counterValue').textContent = counter;
}

function resetCounter() {
    counter = 0;
    document.getElementById('counterValue').textContent = counter;
}

// Color Changer
function changeRandomColor() {
    let container = document.querySelector('.container');
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    container.style.background = randomColor;
}

function resetBackground() {
    document.querySelector('.container').style.background = 'white';
}

// Todo List
let todos = [];

function addTodo() {
    let input = document.getElementById('todoInput');
    let todoText = input.value.trim();
    
    if (todoText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Add to array
    todos.push(todoText);
    
    // Clear input
    input.value = '';
    
    // Render todos
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function renderTodos() {
    let todoList = document.getElementById('todoList');
    
    if (todos.length === 0) {
        todoList.innerHTML = '<p style="color: #999;">No tasks yet. Add one!</p>';
        return;
    }
    
    let html = '';
    todos.forEach((todo, index) => {
        html += `
            <div class="todo-item">
                <span>${index + 1}. ${todo}</span>
                <button onclick="deleteTodo(${index})">Delete</button>
            </div>
        `;
    });
    
    todoList.innerHTML = html;
}

// Show/Hide Content
function toggleContent() {
    let content = document.getElementById('hiddenContent');
    if (content.style.display === 'none') {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}
