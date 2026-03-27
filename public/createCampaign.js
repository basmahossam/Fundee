const currUser = localStorage.getItem('currentUser')
if (!currUser) {
    location.href='login.html'
}
const currentUser = JSON.parse(currUser)

const createCampaignForm = document.getElementById('createCampaignForm')
createCampaignForm.addEventListener('submit',async function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const goal = document.getElementById('goal').value
    const category = document.getElementById('category').value
    const deadline = document.getElementById('deadline').value
    const imageFile = document.getElementById('image').files[0]
    const messageDiv = document.getElementById('message')

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
    try {
        const image = await toBase64(imageFile);//

        const newCampaign = {
            title: title,
            description: description,
            goal: parseFloat(goal),
            category:category,
            deadline: deadline,
            image: image, 
            creatorId: currentUser.id,
            isApproved: false
        }
        const response = await fetch('http://localhost:3000/campaigns', {
            method: 'POST',
            body: JSON.stringify(newCampaign)
        })
        if (response.ok) {
            messageDiv.style.color = 'green'
            messageDiv.textContent = 'Campaign submitted successfully Waiting For Admin approval'
            location.href='index.html'
        } else { throw new Error() }
    } catch (error) {
        messageDiv.style.color = 'red'
        messageDiv.textContent = 'Failed to submit campaign. Check connection.'
    }
})