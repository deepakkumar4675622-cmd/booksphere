// Book Management
let currentBooks = [];

function loadBooks() {
    currentBooks = library.books;
    displayBooks(currentBooks);
    updateBookStats();
}

function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;
    
    if (books.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:3rem;">No books found</div>';
        return;
    }
    
    grid.innerHTML = books.map(book => `
        <div class="book-card">
            <h3><i class="fas fa-book"></i> ${escapeHtml(book.title)}</h3>
            <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Location:</strong> ${book.location || 'Not assigned'}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;">
                <span class="book-status ${book.available > 0 ? 'status-available' : 'status-issued'}">
                    ${book.available > 0 ? `Available (${book.available}/${book.quantity})` : 'Issued'}
                </span>
                ${book.available > 0 ? 
                    `<button onclick="quickIssue(${book.id})" class="btn-primary" style="padding:5px 15px;font-size:0.85rem;">Issue</button>` : 
                    '<button disabled style="padding:5px 15px;opacity:0.5;">Unavailable</button>'}
            </div>
        </div>
    `).join('');
}

function updateBookStats() {
    const total = library.books.length;
    const available = library.books.reduce((sum, b) => sum + b.available, 0);
    const issued = total - available;
    
    document.getElementById('totalBooksCount').textContent = total;
    document.getElementById('availableBooksCount').textContent = available;
    document.getElementById('issuedBooksCount').textContent = issued;
}

function searchBooks() {
    const keyword = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    let filtered = library.searchBooks(keyword);
    
    if (category) {
        filtered = filtered.filter(book => book.category === category);
    }
    
    if (status === 'available') {
        filtered = filtered.filter(book => book.available > 0);
    } else if (status === 'issued') {
        filtered = filtered.filter(book => book.available === 0);
    }
    
    displayBooks(filtered);
}

function showAddBookModal() {
    document.getElementById('addBookModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addBookModal').style.display = 'none';
}

document.getElementById('addBookForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookISBN').value,
        publisher: document.getElementById('bookPublisher').value,
        category: document.getElementById('bookCategory').value,
        quantity: parseInt(document.getElementById('bookQuantity').value),
        year: parseInt(document.getElementById('bookYear').value),
        location: document.getElementById('bookLocation').value
    };
    
    library.addBook(bookData);
    closeModal();
    loadBooks();
    e.target.reset();
    alert('Book added successfully!');
});

function quickIssue(bookId) {
    // Redirect to transactions page with book pre-selected
    window.location.href = `transactions.html?bookId=${bookId}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
document.getElementById('searchInput')?.addEventListener('input', searchBooks);
document.getElementById('categoryFilter')?.addEventListener('change', searchBooks);
document.getElementById('statusFilter')?.addEventListener('change', searchBooks);

// Initialize
document.addEventListener('DOMContentLoaded', loadBooks);