// Populate issued books dropdown
function populateIssuedBooks() {
    const issuedBookSelect = document.getElementById('issuedBookSelect');
    if (!issuedBookSelect) return;
    
    const currentIssued = getCurrentIssuedBooks();
    
    if (currentIssued.length === 0) {
        issuedBookSelect.innerHTML = '<option value="">-- No books currently issued --</option>';
        document.getElementById('issuedBooksList').innerHTML = '<p>No books currently issued</p>';
        return;
    }
    
    issuedBookSelect.innerHTML = '<option value="">-- Choose an issued book --</option>' + 
        currentIssued.map(issue => 
            `<option value="${issue.id}">${issue.bookTitle} - Issued to ${issue.memberName} (Due: ${issue.dueDate})</option>`
        ).join('');
    
    displayIssuedBooksList(currentIssued);
}

// Display all issued books
function displayIssuedBooksList(issuedBooks) {
    const container = document.getElementById('issuedBooksList');
    if (!container) return;
    
    container.innerHTML = issuedBooks.map(issue => `
        <div class="issued-book-item" onclick="selectIssuedBook(${issue.id})">
            <strong>📖 ${escapeHtml(issue.bookTitle)}</strong><br>
            👤 Issued to: ${escapeHtml(issue.memberName)}<br>
            📅 Issue Date: ${issue.issueDate} | Due: ${issue.dueDate}
            <span class="status-badge">Currently Issued</span>
        </div>
    `).join('');
}

// Select issued book from list
function selectIssuedBook(issueId) {
    document.getElementById('issuedBookSelect').value = issueId;
    document.getElementById('issuedBookSelect').dispatchEvent(new Event('change'));
    document.getElementById('issuedBookSelect').scrollIntoView({ behavior: 'smooth' });
}

// Calculate and display fine
function calculateFine(dueDate, returnDate) {
    if (!returnDate) return 0;
    
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    
    if (returned <= due) return 0;
    
    const daysLate = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
    const fine = daysLate * 10;
    
    return fine;
}

// Update fine info when book is selected
document.getElementById('issuedBookSelect')?.addEventListener('change', (e) => {
    const issueId = parseInt(e.target.value);
    const issue = libraryData.issuedBooks.find(i => i.id === issueId);
    const fineDiv = document.getElementById('fineInfo');
    
    if (!issue || !fineDiv) return;
    
    const returnDate = document.getElementById('returnDate').value;
    if (returnDate) {
        const fine = calculateFine(issue.dueDate, returnDate);
        if (fine > 0) {
            fineDiv.innerHTML = `
                <div class="fine-alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    Late Return! Fine: ₹${fine}
                </div>
            `;
        } else {
            fineDiv.innerHTML = '<div class="fine-success">✓ No fine applicable</div>';
        }
    } else {
        fineDiv.innerHTML = '<div class="fine-info-text">Select return date to calculate fine</div>';
    }
});

// Update fine when return date changes
document.getElementById('returnDate')?.addEventListener('change', () => {
    const issueSelect = document.getElementById('issuedBookSelect');
    if (issueSelect.value) {
        issueSelect.dispatchEvent(new Event('change'));
    }
});

// Handle return form submission
document.getElementById('returnForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const issueId = parseInt(document.getElementById('issuedBookSelect').value);
    const returnDate = document.getElementById('returnDate').value;
    
    if (!issueId || !returnDate) {
        alert('Please select an issued book and return date');
        return;
    }
    
    const issue = libraryData.issuedBooks.find(i => i.id === issueId);
    if (!issue) {
        alert('Issue record not found');
        return;
    }
    
    const fine = calculateFine(issue.dueDate, returnDate);
    let message = 'Book returned successfully!';
    if (fine > 0) {
        message += ` Fine amount: ₹${fine}`;
    }
    
    const result = returnBook(issueId, returnDate);
    
    if (result) {
        alert(message);
        document.getElementById('returnForm').reset();
        populateIssuedBooks();
        
        // Update stats on other pages
        if (typeof updateStats === 'function') updateStats();
    } else {
        alert('Failed to return book');
    }
});

// Set default return date to today
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const returnDateInput = document.getElementById('returnDate');
    if (returnDateInput) {
        returnDateInput.value = today;
    }
    populateIssuedBooks();
});