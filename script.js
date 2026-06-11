// Update homepage statistics
function updateStats() {
    const totalBooks = libraryData.books.length;
    const totalMembers = libraryData.members.length;
    const totalIssued = libraryData.issuedBooks.filter(i => !i.returnDate).length;
    
    document.getElementById('totalBooks').textContent = totalBooks;
    document.getElementById('totalMembers').textContent = totalMembers;
    document.getElementById('totalIssued').textContent = totalIssued;
}

// Animate stats counter
function animateStats() {
    const stats = document.querySelectorAll('.stat-card h3');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Mobile menu toggle
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    animateStats();
});