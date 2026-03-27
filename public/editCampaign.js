document.addEventListener('DOMContentLoaded', () => {
    const queryString = location.search
    const campaignId = queryString.split("=")[1]   

    EditCampaign(campaignId)
})
async function EditCampaign(campaignId) {
    const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`)
    const campaign = await response.json()

    const title = document.getElementById('title')
    title.value=campaign.title
    const description = document.getElementById('description')
        description.value=campaign.description
    const goal = document.getElementById('goal')
        goal.value=campaign.goal
    const category = document.getElementById('category')
        category.value=campaign.category
    const deadline = document.getElementById('deadline')
        deadline.value = campaign.deadline    
}

const createCampaignForm = document.getElementById('createCampaignForm')
createCampaignForm.addEventListener('submit',async function (e) {
    e.preventDefault()
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const goal = document.getElementById('goal').value
    const category = document.getElementById('category').value
    const deadline = document.getElementById('deadline').value
    const messageDiv = document.getElementById('message')

    const queryString = location.search
    const campaignId = queryString.split("=")[1]    


    try {
        const updatedCampaign = {
            title: title,
            description: description,
            goal: parseFloat(goal),
            category:category,
            deadline: deadline
        }
        const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedCampaign)
        })
        if (response.ok) {
            messageDiv.style.color = 'green'
            messageDiv.textContent = 'Campaign updated successfully'
            location.href='myData.html'
        } else { throw new Error() }//
    } catch (error) {
        messageDiv.style.color = 'red'
        messageDiv.textContent = 'Failed to edit Check connection.'
    }
})