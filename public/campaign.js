document.addEventListener('DOMContentLoaded', () => {
    const queryString = location.search
    const campaignId = queryString.split("=")[1]    

    if (!campaignId) {
        document.getElementById('campaigncontainer').innerHTML = '<p style="color:red;">Campaign not found</p>'
        return;
    }
    loadCampaignDetails(campaignId)
})

async function loadCampaignDetails(campaignId) {
    const container = document.getElementById('campaigncontainer');
    const user = localStorage.getItem('currentUser');
    const currentUser = user ? JSON.parse(user) : ""
    
    try {
        const campaignRes = await fetch(`http://localhost:3000/campaigns/${campaignId}`)
        const pledgesRes = await fetch(`http://localhost:3000/pledges?campaignId=${campaignId}`)

        const campaign = await campaignRes.json()
        const pledges = await pledgesRes.json()

        const totalRaised = pledges.reduce((sum, pledge) => sum + Number(pledge.amount), 0)
        const progressPercentage = Math.min((totalRaised / campaign.goal) * 100, 100)

        
        let pledgeHTML = ''
        if (currentUser) {
            pledgeHTML = `
                <form id="pledgeForm">
                    <div class="formgroup">
                        <label for="pledgeAmount">Pledge Amount $</label>
                        <input type="number" id="pledgeAmount" min="1" required>
                    </div>
                    <button type="submit" class="btn" >
                        Support This Campaign
                    </button>
                </form>
            `
        } else {
            pledgeHTML = `<p>Please <a href="login.html">log in</a> or <a href="register.html">register</a> to support this campaign</p>`
        }

        const backersHTML = pledges.length > 0
            ? pledges.map(p => `<div class="pledge">User ${p.userId} pledged <strong>$${p.amount}</strong></div>`).join('')
            : '<p>No backers yet Be the first!</p>'
        
        container.innerHTML = `
            <div class="campaignheader">
                <h2>${campaign.title}</h2>
                <img src="${campaign.image}" class="campaignimage">
            </div>
            
            <p style="font-size: 1.5rem; margin:1rem 1rem 1rem 0;">${campaign.description}</p>
            
            <div class="fundingstatus">
                <h3>$${totalRaised} raised of $${campaign.goal} goal</h3>
                <p>Deadline: <strong>${campaign.deadline}</strong></p>
                <div id="pledgeAmountBar">
                    <div id="pledgeAmountBarLevel" style="width: ${progressPercentage}%;"></div>
                </div>
            </div>

            <div class="pledgesection">
                <h3>Make a Pledge</h3>
                ${pledgeHTML}
            </div>

            <div class="backerssection">
                <h3>Backers</h3>
                ${backersHTML}
            </div>
        `

        if (currentUser) {
            document.getElementById('pledgeForm').addEventListener('submit', function(e) {
                e.preventDefault()
                handlePledge(campaignId, currentUser.id)
            })
        }

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p style="color:red;">Error loading campaign details</p>'
    }
}

async function handlePledge(campaignId, userId) {
    const amountInput = document.getElementById('pledgeAmount').value

    const newPledge = {
        campaignId: campaignId,
        userId: userId,
        amount: Number(amountInput)
    }

    const response = await fetch('http://localhost:3000/pledges', {
        method: 'POST',
        body: JSON.stringify(newPledge)
    })

    if (response.ok) {
        alert('Thank you for your support')
        location.reload()
    }
} 