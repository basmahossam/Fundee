const form = document.getElementById('loginForm')
    form.addEventListener('submit', async function (e) {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const messageDiv = document.getElementById('message')

    try {
        const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
        const users = await response.json();

        if (users.length > 0) {
            const user = users[0]; 

            if (user.isActive === false) {
                messageDiv.style.color = 'red'
                messageDiv.textContent = 'Your account has been suspended by an Admin.'
                return
            }

            const currentUser = {
                id: user.id,
                name: user.name,
                role: user.role
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser))

            messageDiv.style.color = 'green'
            messageDiv.textContent = 'Login successfuly'

            if (user.role == 'admin') {
                location.href = 'admin.html'
            } else {
                location.href = 'index.html'
            }

        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'Invalid email or password';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Cannot connect to the server';
    }
});