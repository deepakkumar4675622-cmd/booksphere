// Library Data Management System
class LibraryData {
    constructor() {
        this.books = [];
        this.members = [];
        this.transactions = [];
        this.activityLog = [];
        this.loadData();
    }
    
    loadData() {
        // Load from localStorage or initialize with sample data
        const saved = localStorage.getItem('booksphere_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.books = data.books || [];
            this.members = data.members || [];
            this.transactions = data.transactions || [];
            this.activityLog = data.activityLog || [];
        } else {
            this.initSampleData();
        }
    }
    
    initSampleData() {
        // Sample Books
        this.books = [
            { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", category: "Fiction", publisher: "Scribner", year: 1925, quantity: 5, available: 5, location: "A-12" },
            { id: 2, title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", category: "Fiction", publisher: "Secker & Warburg", year: 1949, quantity: 3, available: 2, location: "B-08" },
            { id: 3, title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0-262-03384-8", category: "Technology", publisher: "MIT Press", year: 2009, quantity: 2, available: 1, location: "C-15" },
            { id: 4, title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0-06-231609-7", category: "History", publisher: "Harper", year: 2011, quantity: 4, available: 4, location: "D-03" },
            { id: 5, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", category: "Technology", publisher: "Prentice Hall", year: 2008, quantity: 3, available: 3, location: "C-22" }
        ];
        
        // Sample Members
        this.members = [
            { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210", membershipType: "Student", joinDate: "2024-01-15", address: "123 Main St, City" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "9876543211", membershipType: "Teacher", joinDate: "2024-01-20", address: "456 Oak Ave, Town" },
            { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "9876543212", membershipType: "Student", joinDate: "2024-02-01", address: "789 Pine Rd, Village" }
        ];
        
        // Sample Transactions
        this.transactions = [
            { id: 1, bookId: 2, memberId: 1, type: "ISSUE", date: "2024-02-01", dueDate: "2024-02-15", status: "ISSUED" },
            { id: 2, bookId: 3, memberId: 2, type: "ISSUE", date: "2024-02-05", dueDate: "2024-02-19", status: "ISSUED" }
        ];
        
        this.saveData();
        this.addActivity("System initialized with sample data");
    }
    
    saveData() {
        const data = {
            books: this.books,
            members: this.members,
            transactions: this.transactions,
            activityLog: this.activityLog
        };
        localStorage.setItem('booksphere_data', JSON.stringify(data));
    }
    
    addActivity(message, type = "INFO") {
        const activity = {
            id: Date.now(),
            message: message,
            type: type,
            timestamp: new Date().toISOString()
        };
        this.activityLog.unshift(activity);
        if (this.activityLog.length > 50) this.activityLog.pop();
        this.saveData();
    }
    
    // Book Operations
    addBook(bookData) {
        const newBook = {
            id: Date.now(),
            ...bookData,
            available: bookData.quantity,
            createdAt: new Date().toISOString()
        };
        this.books.push(newBook);
        this.saveData();
        this.addActivity(`Added new book: ${newBook.title}`);
        return newBook;
    }
    
    updateBook(id, updates) {
        const index = this.books.findIndex(b => b.id == id);
        if (index !== -1) {
            this.books[index] = { ...this.books[index], ...updates };
            this.saveData();
            this.addActivity(`Updated book: ${this.books[index].title}`);
            return true;
        }
        return false;
    }
    
    deleteBook(id) {
        const book = this.books.find(b => b.id == id);
        if (book && book.available === book.quantity) {
            this.books = this.books.filter(b => b.id != id);
            this.saveData();
            this.addActivity(`Deleted book: ${book.title}`);
            return true;
        }
        return false;
    }
    
    searchBooks(keyword) {
        if (!keyword) return this.books;
        keyword = keyword.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword) ||
            book.isbn.includes(keyword)
        );
    }
    
    // Member Operations
    addMember(memberData) {
        const newMember = {
            id: Date.now(),
            ...memberData,
            joinDate: new Date().toISOString().split('T')[0],
            booksIssued: 0
        };
        this.members.push(newMember);
        this.saveData();
        this.addActivity(`Added new member: ${newMember.name}`);
        return newMember;
    }
    
    updateMember(id, updates) {
        const index = this.members.findIndex(m => m.id == id);
        if (index !== -1) {
            this.members[index] = { ...this.members[index], ...updates };
            this.saveData();
            this.addActivity(`Updated member: ${this.members[index].name}`);
            return true;
        }
        return false;
    }
    
    deleteMember(id) {
        const member = this.members.find(m => m.id == id);
        const hasIssued = this.transactions.some(t => t.memberId == id && t.status === "ISSUED");
        if (member && !hasIssued) {
            this.members = this.members.filter(m => m.id != id);
            this.saveData();
            this.addActivity(`Deleted member: ${member.name}`);
            return true;
        }
        return false;
    }
    
    searchMembers(keyword) {
        if (!keyword) return this.members;
        keyword = keyword.toLowerCase();
        return this.members.filter(member => 
            member.name.toLowerCase().includes(keyword) ||
            member.email.toLowerCase().includes(keyword) ||
            member.phone.includes(keyword)
        );
    }
    
    // Transaction Operations
    issueBook(bookId, memberId, dueDays = 14) {
        const book = this.books.find(b => b.id == bookId);
        const member = this.members.find(m => m.id == memberId);
        
        if (!book || !member) return { success: false, message: "Book or member not found" };
        if (book.available <= 0) return { success: false, message: "Book not available" };
        
        const activeIssues = this.transactions.filter(t => t.memberId == memberId && t.status === "ISSUED").length;
        const maxBooks = member.membershipType === "Teacher" ? 7 : 3;
        if (activeIssues >= maxBooks) return { success: false, message: `Member can only issue ${maxBooks} books` };
        
        // Issue the book
        book.available--;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + dueDays);
        
        const transaction = {
            id: Date.now(),
            bookId: bookId,
            memberId: memberId,
            bookTitle: book.title,
            memberName: member.name,
            type: "ISSUE",
            date: new Date().toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            status: "ISSUED",
            fine: 0
        };
        
        this.transactions.push(transaction);
        this.saveData();
        this.addActivity(`Issued "${book.title}" to ${member.name}`);
        
        return { success: true, transaction: transaction };
    }
    
    returnBook(transactionId, returnDate = null) {
        const transaction = this.transactions.find(t => t.id == transactionId);
        if (!transaction || transaction.status === "RETURNED") {
            return { success: false, message: "Transaction not found or already returned" };
        }
        
        const book = this.books.find(b => b.id == transaction.bookId);
        if (book) book.available++;
        
        const returnDateObj = returnDate ? new Date(returnDate) : new Date();
        const dueDate = new Date(transaction.dueDate);
        let fine = 0;
        
        if (returnDateObj > dueDate) {
            const daysLate = Math.ceil((returnDateObj - dueDate) / (1000 * 60 * 60 * 24));
            fine = daysLate * 10;
        }
        
        transaction.status = "RETURNED";
        transaction.returnDate = returnDateObj.toISOString().split('T')[0];
        transaction.fine = fine;
        
        this.saveData();
        this.addActivity(`Returned "${transaction.bookTitle}" (Fine: ₹${fine})`);
        
        return { success: true, fine: fine };
    }
    
    getActiveIssues() {
        return this.transactions.filter(t => t.status === "ISSUED");
    }
    
    getMemberTransactions(memberId) {
        return this.transactions.filter(t => t.memberId == memberId);
    }
    
    getBookTransactions(bookId) {
        return this.transactions.filter(t => t.bookId == bookId);
    }
    
    // Dashboard Stats
    getStats() {
        const activeIssues = this.getActiveIssues();
        const totalFine = this.transactions.reduce((sum, t) => sum + (t.fine || 0), 0);
        
        return {
            totalBooks: this.books.length,
            totalMembers: this.members.length,
            booksIssued: activeIssues.length,
            availableBooks: this.books.reduce((sum, b) => sum + b.available, 0),
            totalFine: totalFine,
            monthlyCirculation: this.getMonthlyData(),
            categoryDistribution: this.getCategoryData()
        };
    }
    
    getMonthlyData() {
        const monthly = {};
        const last6Months = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleString('default', { month: 'short' });
            monthly[month] = 0;
            last6Months.push(month);
        }
        
        this.transactions.forEach(t => {
            const date = new Date(t.date);
            const month = date.toLocaleString('default', { month: 'short' });
            if (monthly[month] !== undefined) {
                monthly[month]++;
            }
        });
        
        return {
            labels: last6Months,
            values: last6Months.map(m => monthly[m])
        };
    }
    
    getCategoryData() {
        const categories = {};
        this.books.forEach(book => {
            categories[book.category] = (categories[book.category] || 0) + 1;
        });
        return {
            labels: Object.keys(categories),
            values: Object.values(categories)
        };
    }
}

// Initialize global library instance
const library = new LibraryData();