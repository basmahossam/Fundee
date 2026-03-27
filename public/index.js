document.addEventListener('DOMContentLoaded', () => {
    isLoggedin()
    loadCampaigns()
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value
        loadCampaigns(query)
    })
})
function isLoggedin() {
    const navContent = document.getElementById("navside")
    const currUser = localStorage.getItem('currentUser')
    const addbtn = document.getElementById('add')
    if (currUser) {
        navContent.innerHTML=`
            <a href="createCampaign.html">Create Campaign</a>
            <a href="myData.html">My Data</a>
            <button onclick="logout()">Logout</button>`
        addbtn.style.display="block"
    }
    else {
        navContent.innerHTML = `
        <a href="login.html">Login</a>
        <a href="./signin.html">Register</a>`
    }
}
function logout() {
    localStorage.removeItem('currentUser')
    location.reload()
}
async function loadCampaigns(q='') {
    const CampaignsContainer = document.getElementById('maincontainer')
    try {
        const response = await fetch('http://localhost:3000/campaigns?isApproved=true')
        const campaigns = await response.json()

        if (q) {
            CampaignsContainer.innerHTML = ''
            const res = campaigns.filter(campaign => campaign.title.includes(q))

            res.forEach(campaign => {
            const campainDiv = document.createElement("div")
            campainDiv.className = 'card'
            
            campainDiv.innerHTML = `            
            <img src="${campaign.image}"alt="Campaign image">
            <h3>${campaign.title}</h3>
            <p>Goal: ${campaign.goal}$</p>
            <p>Dead Line: ${campaign.deadline}</p>
            <button onclick="showCampaign('${campaign.id}')">Details</button>`
            CampaignsContainer.appendChild(campainDiv)
            })
            return
        }

        if (campaigns.length === 0) {
            CampaignsContainer.innerHTML = '<p>No campaigns found</p>'
            return
        }
        else if (campaigns.length <= 7) {
            campaigns.forEach(campaign => {
            const campainDiv = document.createElement("div")
            campainDiv.className = 'card'
            
            campainDiv.innerHTML = `            
            <img src="${campaign.image}" alt="Campaign image">
            <h3>${campaign.title}</h3>
            <p>Goal: ${campaign.goal}$</p>
            <p>Dead Line: ${campaign.deadline}</p>
            <button onclick="showCampaign('${campaign.id}')">Details</button>` 
            CampaignsContainer.appendChild(campainDiv)
        })
        }
        else if (campaigns.length > 7) {
        const somecampaigns = campaigns.slice(0, 8)
        
        somecampaigns.forEach(campaign => {
            const campainDiv = document.createElement("div")
            campainDiv.className = 'card'
            
            campainDiv.innerHTML = `            
            <img src="${campaign.image}" alt="Campaign image">
            <h3>${campaign.title}</h3>
            <p>Goal: ${campaign.goal}$</p>
            <p>Dead Line: ${campaign.deadline}</p>
            <button onclick="showCampaign('${campaign.id}')">Details</button>`
            CampaignsContainer.appendChild(campainDiv)
        })
    }
    } catch (error) {
        CampaignsContainer.innerHTML='<p style="color:red;">Error loading campaigns.</p>'
    }
}
function showCampaign(campaignid) {
    location.href=`campaign.html?id=${campaignid}`
}