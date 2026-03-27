document.addEventListener('DOMContentLoaded', () => {
    loadUsers()
    loadCampaigns()
    loadPledges()
})
function logout() {
    localStorage.removeItem('currentUser')
    location.href = 'login.html'
}
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody')

    try {
        const response = await fetch('http://localhost:3000/users')
        const users = await response.json()
        
        users.forEach(user => {
            const banBtn = (user.role === 'user'&& user.isActive===true) 
                ? `<button onclick="banUser('${user.id}')" class=banBtn>Ban User</button>` 
                : ''

            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td class="hide">${user.email}</td>
                    <td class="hide">${user.role}</td>
                    <td class="hide" style="color: ${user.isActive ? 'green' : 'red'}; ">${user.isActive ? 'Active' : 'Banned'}</td>
                    <td>${banBtn}</td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Error loading users:', error)
    }
}
async function banUser(userId) {
    try {
        await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PATCH',
            body:JSON.stringify({ isActive: false }) 
        })
        loadUsers() 
    } catch (error) {
        alert('Failed to Ban user')
    }
}

async function loadCampaigns() {
    const tbody = document.getElementById('campaignsTableBody')

    try {
        const response = await fetch('http://localhost:3000/campaigns')
        const campaigns = await response.json()
        
        campaigns.forEach(campaign => {
            tbody.innerHTML += `
                <tr>
                    <td>${campaign.id}</td>
                    <td>${campaign.title}</td>
                    <td class="hide">$${campaign.goal}</td>
                    <td class="hide">${campaign.category}</td>
                    <td class="hide">${campaign.deadline}</td>
                    <td class="hide" style="color: ${campaign.isApproved ? 'green' : 'gray'};">${campaign.isApproved ? 'Approved' : 'Pending/Rejected'}</td>
                    <td>
                        <button onclick="toggleCampaignApproval('${campaign.id}', ${campaign.isApproved})" class="approveBtn">
                            ${campaign.isApproved ? 'Reject' : 'Approve'}
                        </button>
                        <button onclick="deleteCampaign('${campaign.id}')" class="banBtn">Delete</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Error loading campaigns:', error)
    }
}
async function toggleCampaignApproval(campaignId, currentStatus) {
    try {
        await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
            method: 'PATCH',
            body: JSON.stringify({ isApproved: !currentStatus })
        });
        loadCampaigns()
    } catch (error) {
        alert('Failed to update campaign status.')
    }
}
async function deleteCampaign(campaignId) {
    if (!confirm('Are you sure you want to permanently delete this campaign?')) return;

    try {
        await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
            method: 'DELETE'
        })
        loadCampaigns()
    } catch (error) {
        alert('Failed to delete campaign.')
    }
}

async function loadPledges() {
    const tbody = document.getElementById('pledgesTableBody')

    try {
        const response = await fetch('http://localhost:3000/pledges')
        const pledges = await response.json()
    
        tbody.innerHTML = ''
        pledges.forEach(pledge => {
            tbody.innerHTML += `
            <tr>
                <td>${pledge.id}</td>
                <td>${pledge.campaignId}</td>
                <td class="hide">${pledge.userId}</td>
                <td style="color:#19765a;font-weight: bold;">$${pledge.amount}</td>
            </tr>
        `
        })
    } catch (error) {
        console.error('Error loading pledges:', error)
    }
}