// Transaction Management
function loadTransactions() {
    displayTransactions();
    populateDropdowns();
    displayActiveIssues();
}

function displayTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    const transactions = [...library.transactions].reverse();
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = transactions.map(t => `
        <tr>
            <td>#${t.id}</td>
            <td>${t.bookTitle}</td>
            <td>${t.memberName}</td>
            <td><span class="status-badge ${t.type === 'ISSUE' ? 'status-issued' : 'status-returned'}">${t.type}</span></td>
            <td>${t.date}</td>
            <td>${t.dueDate || '-'}</td>
            <td>${t.fine ? `₹${t.fine}` : '-'}</td>
        </tr>
    `).join('');
}

function populateDropdowns() {
    const bookSelect = document.getElementById('bookSelect');
    const memberSelect = document.getElementById('memberSelect');
    
    if (bookSelect) {
        const availableBooks = library.books.filter(b => b.available > 0);
        bookSelect.innerHTML = '<option value="">Select Book</option>' + 
            availableBooks.map(b => `<option value="${b.id}">${b.title} by ${b.author} (${b.available} left)</option>`).join('');
    }
    
    if (memberSelect) {
        memberSelect.innerHTML = '<option value="">Select Member</option>' + 
            library.members.map(m => `<option value="${m.id}">${m.name} (${m.membershipType})</option>`).join('');
    }
    
    // Check URL param for bookId
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    if (bookId && bookSelect) {
        bookSelect.value = bookId;
    }
}

function displayActiveIssues() {
    const container = document.getElementById('activeIssuesList');
    if (!container) return;
    
    const activeIssues = library.getActiveIssues();
    
    if (activeIssues.length === 0) {
        container.innerHTML = '<p>No active issues</p>';
        return;
    }
    
    container.innerHTML = activeIssues.map(issue => `
        <div class="active-issue-item">
            <div>
                <strong>📖 ${issue.bookTitle}</strong><br>
                👤 ${issue.memberName}<br>
                📅 Due: ${issue.dueDate}
            </div>
            <button onclick="showReturnModal(${issue.id})" class="btn-small">Return</button>
        </div>
    `).join('');
}

document.getElementById('issueForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bookId = parseInt(document.getElementById('bookSelect').value);
    const memberId = parseInt(document.getElementById('memberSelect').value);
    const dueDays = parseInt(document.getElementById('dueDays').value);
    
    if (!bookId || !memberId) {
        alert('Please select both book and member');
        return;
    }
    
    const result = library.issueBook(bookId, memberId, dueDays);
    
    if (result.success) {
        alert('Book issued successfully!');
        document.getElementById('issueForm').reset();
        loadTransactions();
        populateDropdowns();
        displayActiveIssues();
    } else {
        alert(result.message);
    }
});

function showReturnModal(transactionId) {
    document.getElementById('returnTransactionId').value = transactionId;
    document.getElementById('returnModal').style.display = 'block';
}

function closeReturnModal() {
    document.getElementById('returnModal').style.display = 'none';
}

document.getElementById('returnForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const transactionId = parseInt(document.getElementById('returnTransactionId').value);
    const returnDate = document.getElementById('returnDate').value;
    
    const result = library.returnBook(transactionId, returnDate);
    
    if (result.success) {
        alert(`Book returned successfully! Fine: ₹${result.fine}`);
        closeReturnModal();
        loadTransactions();
        populateDropdowns();
        displayActiveIssues();
    } else {
        alert(result.message);
    }
});

// Set default return date
document.getElementById('returnDate').value = new Date().toISOString().split('T')[0];

// Initialize
document.addEventListener('DOMContentLoaded', loadTransactions);