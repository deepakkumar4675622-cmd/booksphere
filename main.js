// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
let isDarkMode = true;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.body.style.background = "linear-gradient(135deg, #0a0e27 0%, #0f1535 100%)";
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.style.background = "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)";
            document.body.style.color = "#1a1a2e";
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

// Update homepage stats
function updateHomepageStats() {
    const stats = library.getStats();
    const statBooks = document.getElementById('statBooks');
    const statMembers = document.getElementById('statMembers');
    const statIssued = document.getElementById('statIssued');
    
    if (statBooks) animateNumber(statBooks, 0, stats.totalBooks);
    if (statMembers) animateNumber(statMembers, 0, stats.totalMembers);
    if (statIssued) animateNumber(statIssued, 0, stats.booksIssued);
}

// Animate number counter
function animateNumber(element, start, end) {
    let current = start;
    const increment = Math.ceil(end / 50);
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = current;
        }
    }, 20);
}

// Scroll to features
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// Export activity log
function exportActivity() {
    const activities = library.activityLog;
    const csv = activities.map(a => `${a.timestamp},${a.message},${a.type}`).join('\n');
    const blob = new Blob(["Timestamp,Message,Type\n" + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "activity_log.csv";
    link.click();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateHomepageStats();
    }
});