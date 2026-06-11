// Initialize Dashboard
let circulationChart, categoryChart;

function initDashboard() {
    const stats = library.getStats();
    
    // Update stats
    document.getElementById('totalBooks').textContent = stats.totalBooks;
    document.getElementById('totalMembers').textContent = stats.totalMembers;
    document.getElementById('booksIssued').textContent = stats.booksIssued;
    document.getElementById('totalFine').textContent = `₹${stats.totalFine}`;
    
    // Create charts
    createCirculationChart(stats.monthlyCirculation);
    createCategoryChart(stats.categoryDistribution);
    
    // Show recent activity
    displayRecentActivity();
}

function createCirculationChart(data) {
    const ctx = document.getElementById('circulationChart').getContext('2d');
    if (circulationChart) circulationChart.destroy();
    
    circulationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Books Issued',
                data: data.values,
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
            }
        }
    });
}

function createCategoryChart(data) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChart) categoryChart.destroy();
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: ['#00d4ff', '#7000ff', '#00ff88', '#ffaa00', '#ff3366']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } }
            }
        }
    });
}

function displayRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const recentActivities = library.activityLog.slice(0, 10);
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = '<div class="activity-item">No recent activities</div>';
        return;
    }
    
    activityList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.message}</p>
                <span class="activity-time">${formatDate(activity.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    switch(type) {
        case 'ISSUE': return 'fa-hand-holding-heart';
        case 'RETURN': return 'fa-undo-alt';
        default: return 'fa-info-circle';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleDateString();
}

// Initialize
document.addEventListener('DOMContentLoaded', initDashboard);