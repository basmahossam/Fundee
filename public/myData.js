document.addEventListener('DOMContentLoaded', () => {
    getUser()
})

async function getUser() {
    try {
        const currUser = localStorage.getItem('currentUser')
        const currentUser = JSON.parse(currUser)

        loadCampaigns(currentUser.id)
        loadPledges(currentUser.id)

    } catch (error) {
        console.error('Error loading user:', error)
    }
}

async function loadCampaigns(user) {
    const tbody = document.getElementById('campaignsTableBody')

    try {
        const response = await fetch(`http://localhost:3000/campaigns`)
        const campaigns = await response.json()

        const myCampaigns = campaigns.filter(campaign => campaign.creatorId === user)

        myCampaigns.forEach(campaign => {        
            tbody.innerHTML += `
                <tr>
                    <td>${campaign.id}</td>
                    <td>${campaign.title}</td>
                    <td class="hide">$${campaign.goal}</td>
                    <td class="hide">${campaign.category}</td>
                    <td class="hide">${campaign.deadline}</td>
                    <td class="hide" style="color: ${campaign.isApproved ? 'green' : 'gray'};">${campaign.isApproved ? 'Approved' : 'Pending/Rejected'}</td>
                    <td>
                        <button onclick="edit('${campaign.id}')" class="approveBtn">Edit</button>
                        <button onclick="deleteCampaign('${campaign.id}')" class="banBtn">Delete</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Error loading campaigns:', error)
    }
}

async function edit(campaignId) {
    location.href=`editCampaign.html?id=${campaignId}`
}

async function deleteCampaign(campaignId) {
    if (!confirm('Are you sure you want to permanently delete this campaign?')) return

    try {
        await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
            method: 'DELETE'
        })
        loadCampaigns()
    } catch (error) {
        alert('Failed to delete campaign.')
    }
}

async function loadPledges(user) {
    const tbody = document.getElementById('pledgesTableBody')

    try {
        const response = await fetch(`http://localhost:3000/pledges`)
        const pledges = await response.json()

        const myPledges = pledges.filter(pledge => pledge.userId === user)

        myPledges.forEach(pledge => {
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