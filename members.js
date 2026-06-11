// Member Management
let currentMembers = [];

function loadMembers() {
    currentMembers = library.members;
    displayMembers(currentMembers);
}

function displayMembers(members) {
    const grid = document.getElementById('membersGrid');
    if (!grid) return;
    
    if (members.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:3rem;">No members found</div>';
        return;
    }
    
    const activeIssues = library.getActiveIssues();
    
    grid.innerHTML = members.map(member => {
        const memberIssues = activeIssues.filter(i => i.memberId === member.id);
        return `
            <div class="member-card">
                <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
                    <div style="width:50px;height:50px;background:rgba(0,212,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                        <i class="fas fa-user" style="font-size:1.5rem;"></i>
                    </div>
                    <div>
                        <h3>${escapeHtml(member.name)}</h3>
                        <span class="member-type">${member.membershipType}</span>
                    </div>
                </div>
                <p><i class="fas fa-envelope"></i> ${member.email}</p>
                <p><i class="fas fa-phone"></i> ${member.phone}</p>
                <p><i class="fas fa-calendar"></i> Joined: ${member.joinDate}</p>
                <div class="member-stats">
                    <span>📚 Books Issued: ${memberIssues.length}</span>
                </div>
                ${memberIssues.length > 0 ? `
                    <details style="margin-top:0.5rem;">
                        <summary style="cursor:pointer;color:var(--primary);">Current Books</summary>
                        <ul style="margin-top:0.5rem;padding-left:1rem;">
                            ${memberIssues.map(i => `<li>${i.bookTitle} (Due: ${i.dueDate})</li>`).join('')}
                        </ul>
                    </details>
                ` : ''}
            </div>
        `;
    }).join('');
}

function searchMembers() {
    const keyword = document.getElementById('searchMemberInput').value;
    const filtered = library.searchMembers(keyword);
    displayMembers(filtered);
}

function showAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'block';
}

function closeMemberModal() {
    document.getElementById('addMemberModal').style.display = 'none';
}

document.getElementById('addMemberForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const memberData = {
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        membershipType: document.getElementById('membershipType').value,
        address: document.getElementById('memberAddress').value
    };
    
    library.addMember(memberData);
    closeMemberModal();
    loadMembers();
    e.target.reset();
    alert('Member added successfully!');
});

// Initialize
document.addEventListener('DOMContentLoaded', loadMembers);