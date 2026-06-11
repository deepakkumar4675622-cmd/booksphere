// Library Data Management
let libraryData = {
    books: [],
    members: [],
    issuedBooks: []
};

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('booksphere_data');
    if (savedData) {
        libraryData = JSON.parse(savedData);
    } else {
        // Initialize with sample data
        libraryData = {
            books: [
                { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", category: "Fiction", isAvailable: true },
                { id: 2, title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", category: "Fiction", isAvailable: true },
                { id: 3, title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0-262-03384-8", category: "Technology", isAvailable: true }
            ],
            members: [
                { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", address: "123 Main St" },
                { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321", address: "456 Oak Ave" }
            ],
            issuedBooks: []
        };
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('booksphere_data', JSON.stringify(libraryData));
}

// Get next ID for book
function getNextBookId() {
    return libraryData.books.length > 0 ? Math.max(...libraryData.books.map(b => b.id)) + 1 : 1;
}

// Get next ID for member
function getNextMemberId() {
    return libraryData.members.length > 0 ? Math.max(...libraryData.members.map(m => m.id)) + 1 : 1;
}

// Add new book
function addBook(book) {
    book.id = getNextBookId();
    book.isAvailable = true;
    libraryData.books.push(book);
    saveData();
    return book;
}

// Add new member
function addMember(member) {
    member.id = getNextMemberId();
    libraryData.members.push(member);
    saveData();
    return member;
}

// Issue book
function issueBook(bookId, memberId, issueDate, dueDate) {
    const book = libraryData.books.find(b => b.id == bookId);
    const member = libraryData.members.find(m => m.id == memberId);
    
    if (!book || !member) return false;
    if (!book.isAvailable) return false;
    
    book.isAvailable = false;
    
    const issueRecord = {
        id: Date.now(),
        bookId: bookId,
        memberId: memberId,
        bookTitle: book.title,
        memberName: member.name,
        issueDate: issueDate,
        dueDate: dueDate,
        returnDate: null,
        fine: 0
    };
    
    libraryData.issuedBooks.push(issueRecord);
    saveData();
    return issueRecord;
}

// Return book
function returnBook(issueId, returnDate) {
    const issueRecord = libraryData.issuedBooks.find(i => i.id == issueId);
    if (!issueRecord || issueRecord.returnDate) return false;
    
    const book = libraryData.books.find(b => b.id == issueRecord.bookId);
    if (book) book.isAvailable = true;
    
    issueRecord.returnDate = returnDate;
    
    // Calculate fine (Rs. 10 per day late)
    const due = new Date(issueRecord.dueDate);
    const returned = new Date(returnDate);
    if (returned > due) {
        const daysLate = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
        issueRecord.fine = daysLate * 10;
    }
    
    saveData();
    return issueRecord;
}

// Search books
function searchBooks(keyword) {
    keyword = keyword.toLowerCase();
    return libraryData.books.filter(book => 
        book.title.toLowerCase().includes(keyword) || 
        book.author.toLowerCase().includes(keyword) ||
        book.isbn.includes(keyword)
    );
}

// Get issued books for a member
function getMemberIssuedBooks(memberId) {
    return libraryData.issuedBooks.filter(issue => issue.memberId == memberId && !issue.returnDate);
}

// Get all currently issued books
function getCurrentIssuedBooks() {
    return libraryData.issuedBooks.filter(issue => !issue.returnDate);
}

// Get recent issues (last 5)
function getRecentIssues() {
    return [...libraryData.issuedBooks].reverse().slice(0, 5);
}

// Initialize data
loadData();