document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
        username: username,
        password: password
    };

    fetch('http://localhost:5050/login/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                const token = data.accessToken; 
                localStorage.setItem('token', token);
                console.log('token', token);
                localStorage.setItem('username', username); // Lưu username vào Local Storage
                window.location.href = 'detailinfo.html';
            });
        } else {
            document.getElementById("loginError").innerText = "Đăng nhập không thành công";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
