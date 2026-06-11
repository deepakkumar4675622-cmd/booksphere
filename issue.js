// Populate book and member dropdowns
function populateDropdowns() {
    const bookSelect = document.getElementById('bookSelect');
    const memberSelect = document.getElementById('memberSelect');
    
    if (!bookSelect || !memberSelect) return;
    
    // Populate available books
    const availableBooks = libraryData.books.filter(book => book.isAvailable);
    bookSelect.innerHTML = '<option value="">-- Choose a book --</option>' + 
        availableBooks.map(book => `<option value="${book.id}">${book.title} by ${book.author}</option>`).join('');
    
    // Populate members
    memberSelect.innerHTML = '<option value="">-- Choose a member --</option>' + 
        libraryData.members.map(member => `<option value="${member.id}">${member.name} (${member.email})</option>`).join('');
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + 14);
    const dueDate = due.toISOString().split('T')[0];
    
    document.getElementById('issueDate').value = today;
    document.getElementById('dueDate').value = dueDate;
}

// Display recent issues
function displayRecentIssues() {
    const recentContainer = document.getElementById('recentIssuesList');
    if (!recentContainer) return;
    
    const recent = getRecentIssues();
    
    if (recent.length === 0) {
        recentContainer.innerHTML = '<p>No recent issues</p>';
        return;
    }
    
    recentContainer.innerHTML = recent.map(issue => `
        <div class="recent-issue-item">
            <strong>${escapeHtml(issue.bookTitle)}</strong><br>
            Issued to: ${escapeHtml(issue.memberName)}<br>
            Issue Date: ${issue.issueDate} | Due: ${issue.dueDate}
            ${issue.returnDate ? '<span class="returned">✓ Returned</span>' : '<span class="issued">📖 Issued</span>'}
        </div>
    `).join('');
}

// Handle issue form submission
document.getElementById('issueForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('bookSelect').value;
    const memberId = document.getElementById('memberSelect').value;
    const issueDate = document.getElementById('issueDate').value;
    const dueDate = document.getElementById('dueDate').value;
    
    if (!bookId || !memberId) {
        alert('Please select both book and member');
        return;
    }
    
    const result = issueBook(parseInt(bookId), parseInt(memberId), issueDate, dueDate);
    
    if (result) {
        alert('Book issued successfully!');
        document.getElementById('issueForm').reset();
        populateDropdowns();
        displayRecentIssues();
        
        // Update stats on other pages
        if (typeof updateStats === 'function') updateStats();
    } else {
        alert('Failed to issue book. Book might be unavailable or member invalid.');
    }
});

// Check for bookId in URL
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    if (bookId && document.getElementById('bookSelect')) {
        document.getElementById('bookSelect').value = bookId;
    }
}

// Initialize issue page
document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    displayRecentIssues();
    checkUrlParams();
});