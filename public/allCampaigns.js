document.addEventListener('DOMContentLoaded', () => {
    isLoggedin()
    loadCampaigns()
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value
        loadCampaigns(query)
    })
})
const category = document.getElementById('category')
category.addEventListener('change',() => {
    const CampaignsContainer = document.getElementById('maincontainer')
    const selectedcategory = category.value  
    CampaignsContainer.innerHTML = ''
    
    loadCampaigns(selectedcategory)
})

    
function isLoggedin() {
    const navContent = document.getElementById("navside")
    const currUser = localStorage.getItem('currentUser')
    if (currUser) {
        navContent.innerHTML=`
            <a href="createCampaign.html">Create Campaign</a>
            <a href="myData.html">My Data</a>
            <button onclick="logout()">Logout</button>`
    }
    else {
        navContent.innerHTML = `
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>`
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
            const rescat = campaigns.filter(campaign => campaign.category===q)

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

            rescat.forEach(campaign => {
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
            CampaignsContainer.innerHTML = '<p>No campaigns</p>'
            return
        }

        campaigns.forEach(campaign => {
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
            
    } catch (error) {
        console.error(error)
        CampaignsContainer.innerHTML='<p style="color:red;">Error loading campaigns.</p>'
    }
}
function showCampaign(campaignid) {
    location.href=`campaign.html?id=${campaignid}`
}