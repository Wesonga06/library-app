// --- SET YOUR LARAVEL API URL ---
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

// ==========================================
// 1. REGISTRATION HANDLER (LARAVEL API)
// ==========================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;
        const regMessage = document.getElementById('regMessage');

        // Bundle data EXACTLY as your AuthController validates it
        const userData = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            password_confirmation: password // Laravel needs this!
        };

        try {
            regMessage.style.color = '#667eea';
            regMessage.innerText = "Connecting to server...";

            // Send to Laravel API
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                regMessage.style.color = 'green';
                regMessage.innerText = "Registration successful! Redirecting...";
                setTimeout(() => window.location.href = 'index.html', 1500);
            } else {
                regMessage.style.color = 'red';
                regMessage.innerText = data.message || "Registration failed.";
                console.error("Laravel Errors:", data.errors);
            }
        } catch (error) {
            regMessage.style.color = 'red';
            regMessage.innerText = "Server error. Is Laravel running?";
        }
    });
}

// ==========================================
// 2. LOGIN HANDLER (LARAVEL API)
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Note: Make sure your index.html input is ID 'username' or change this
        const email = document.getElementById('email').value; 
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');

        try {
            messageDiv.style.color = '#667eea';
            messageDiv.innerText = "Authenticating...";

            // Send to Laravel API
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Save the Sanctum Token to LocalStorage!
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('currentUser', data.user.name); 
                
                messageDiv.style.color = 'green';
                messageDiv.innerText = `Welcome back, ${data.user.name}!`;
                
                setTimeout(() => window.location.href = 'landing.html', 1000);
            } else {
                messageDiv.style.color = 'red';
                messageDiv.innerText = data.message || "Invalid credentials.";
            }
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.innerText = "Server error. Is Laravel running?";
        }
    });
}

// ==========================================
// 3. UI EXTRAS 
// ==========================================
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

// ==========================================
// 4. ADMIN BOOK MANAGEMENT (LARAVEL API)
// ==========================================
const bookForm = document.getElementById('bookForm');
const bookListUl = document.querySelector('#bookList ul');

function getAuthToken() {
    return localStorage.getItem('auth_token');
}

async function fetchBooks() {
    if (!bookListUl) return; // Only run if book list exists on page
    
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}` 
            }
        });
        
        if (response.ok) {
            const books = await response.json(); 
            renderBookList(books);
        } else {
            console.error("Failed to fetch books. Are you logged in?");
        }
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

if (bookForm) {
    bookForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const newBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            year: document.getElementById('year').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(newBook)
            });

            if (response.ok) {
                bookForm.reset(); 
                fetchBooks();     
            } else {
                alert("Could not add book. Please check your connection.");
            }
        } catch (error) {
            console.error("Error adding book:", error);
        }
    });
}

function renderBookList(books) {
    bookListUl.innerHTML = '';
    books.forEach((book) => {
        const li = document.createElement('li');
        li.innerText = `${book.title} by ${book.author} (${book.year})`;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = '🗑️ Delete';
        
        deleteBtn.addEventListener('click', async () => {
            if(!confirm(`Are you sure you want to delete "${book.title}"?`)) return;

            try {
                const response = await fetch(`${API_BASE_URL}/books/${book.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });

                if (response.ok) {
                    fetchBooks(); 
                } else {
                    alert("Failed to delete book.");
                }
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        });

        li.appendChild(deleteBtn);
        bookListUl.appendChild(li);
    });
}

// Trigger fetch immediately when the page loads
if (document.getElementById('bookList')) {
    fetchBooks();
}