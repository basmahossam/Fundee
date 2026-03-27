document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault()

    const nameInput = document.getElementById('name').value
    const emailInput = document.getElementById('email').value
    const passwordInput = document.getElementById('password').value
    const messageDiv = document.getElementById('message')

    const newUser = {
        name: nameInput,
        role: "user",           
        isActive: true,           
        email: emailInput,
        password: passwordInput 
    }

    try {
        await fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify(newUser)
        })
        location.href = 'login.html'
    } catch (error) {
        console.error('Error:', error)
        messageDiv.style.color = 'red'
        messageDiv.textContent = 'Registration failed Please try again'
    }
})