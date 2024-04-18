document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {

        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';
        document.getElementById('nav-welcome').style.display = 'block';
        document.getElementById('username').textContent = username;

        // Gửi yêu cầu API để lấy vai trò
        axios.get('http://localhost:5050/member/role', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const role = response.data; 
            console.log("Role:", role);

            if (role === 'ADMIN') {
                document.getElementById('nav-admin').style.display = 'block';
            } else {
                console.log("role", role);
                document.getElementById('nav-admin').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

        axios.get('http://localhost:5050/member/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const data = response.data;
            console.log(data);
            document.getElementById('img').src = './image cinema/' + data.image;
            document.getElementById('fullname').textContent = data.fullname;
            document.querySelector('.address').textContent = data.address;
            document.querySelector('.phone').textContent = data.phone;
            document.querySelector('.birthday').textContent = data.birthday;
            document.querySelector('.email').textContent = data.email;
            document.querySelector('.number').textContent = data.money;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    } else {
        window.location.href = 'login.html';
    }

    document.getElementById("btn-thong-tin").addEventListener("click", function () {
        window.location.href = "detailinfo.html";
    });
});




