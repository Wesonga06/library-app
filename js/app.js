// --- REGISTRATION HANDLER ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const regMessage = document.getElementById('regMessage');

        const existingUser = localStorage.getItem(username);
        if (existingUser) {
            regMessage.style.color = 'red';
            regMessage.innerText = "Username already taken!";
        } else {
            localStorage.setItem(username, password);
            regMessage.style.color = 'green';
            regMessage.innerText = "Registration successful! Redirecting...";
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}

// --- LOGIN HANDLER ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');

        const storedPassword = localStorage.getItem(username);

        if (storedPassword && storedPassword === password) {
            // Save the current user to display their name on the landing page
            localStorage.setItem('currentUser', username);
            messageDiv.style.color = 'green';
            messageDiv.innerText = `Welcome back, ${username}!`;
            
            setTimeout(() => {
                window.location.href = 'landing.html';
            }, 1000);
        } else {
            messageDiv.style.color = 'red';
            messageDiv.innerText = "Invalid username or password.";
        }
    });
}

// --- PASSWORD VISIBILITY TOGGLE ---
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });
    togglePassword.addEventListener('mouseover', () => togglePassword.style.opacity = '1');
    togglePassword.addEventListener('mouseout', () => togglePassword.style.opacity = '0.6');
}

// --- LANDING PAGE GREETING ---
const welcomeText = document.getElementById('welcomeText');
if (welcomeText) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        welcomeText.innerText = `✨ Welcome, ${currentUser}!`;
    }
}

// --- ADMIN BOOK MANAGEMENT ---
const bookForm = document.getElementById('bookForm');
const bookListUl = document.querySelector('#bookList ul');
const books = []; 

if (bookForm) {
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const book = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            year: document.getElementById('year').value
        };

        books.push(book);
        renderBookList();
        bookForm.reset();
    });
}

function renderBookList() {
    bookListUl.innerHTML = '';

    books.forEach((book, index) => {
        const li = document.createElement('li');
        li.innerText = `${book.title} by ${book.author} (${book.year})`;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = '🗑️ Delete';
        
        deleteBtn.addEventListener('click', () => {
            books.splice(index, 1); 
            renderBookList();
        });

        li.appendChild(deleteBtn);
        bookListUl.appendChild(li);
    });
}