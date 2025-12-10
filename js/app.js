//
// LOGIN FORM HANDLER
//
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload

        // Create JS object from input values
        const user = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        console.log('JS Object:', user); // View in console

        // Show feedback message
        const messageDiv = document.getElementById('message');
        messageDiv.innerText = `Hello ${user.username}, you are ready to continue!`;

        // Convert to JSON
        const userJSON = JSON.stringify(user);
        console.log('JSON String:', userJSON);

        // Redirect to landing page after 1 second
        setTimeout(() => {
            window.location.href = 'landing.html';
        }, 1000);
    });
}

//
// ADMIN BOOK MANAGEMENT
//
const bookForm = document.getElementById('bookForm');
const bookListUl = document.querySelector('#bookList ul');
const books = []; // Array to store books

if (bookForm) {
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create book object
        const book = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            year: document.getElementById('year').value
        };

        // Add to books array
        books.push(book);

        // Update DOM
        renderBookList();

        // Reset form
        bookForm.reset();
    });
}

// Render books in the list
function renderBookList() {
    // Clear current list to prevent duplicates
    bookListUl.innerHTML = '';

    books.forEach((book, index) => {
        const li = document.createElement('li');
        li.innerText = `${book.title} by ${book.author} (${book.year})`;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.style.width = 'auto'; // Override the 100% width from CSS
        
        deleteBtn.addEventListener('click', () => {
            books.splice(index, 1); // Remove from array
            renderBookList(); // Re-render
        });

        li.appendChild(deleteBtn);
        bookListUl.appendChild(li);
    });
}