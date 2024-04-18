document.getElementById('user-avatar').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('memberId');

    console.log('Member ID:', memberId);


    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    console.log('Token:', token);

    if (!token) {
        console.error('Token not found!');
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    axios.get(`http://localhost:5050/member/detail/${memberId}`, { headers })
        .then(response => {
            console.log('membr', memberId);
            const member = response.data;
            document.getElementById("user-fullname").value = member.fullname;
            document.getElementById("user-username").value = member.username;
            document.getElementById("user-password").value = member.password;
            document.getElementById("user-birthday").value = member.birthday;
            document.getElementById("user-email").value = member.email;
            document.getElementById("user-phone").value = member.phone;
            document.getElementById("user-address").value = member.address;
            document.getElementById("user-role").value = member.role;
            if (member.image) {
                document.getElementById('preview-avatar').src = `./image cinema/${member.image}`;
            }
        })
        .catch(error => {
            console.error('Error fetching member details:', error);
        });
};

function updateUser(event) {
    event.preventDefault();  // Ngăn chặn sự kiện mặc định của form

    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('memberId');
    if (!memberId) {
        console.error('Member ID not found!');
        return;
    }

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    if (!token) {
        console.error('Token not found!');
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const formData = new FormData();
    formData.append("fullname", document.getElementById("user-fullname").value || '');
    formData.append("username", document.getElementById("user-username").value || '');
    formData.append("password", document.getElementById("user-password").value || '');
    formData.append("birthday", document.getElementById("user-birthday").value || '');
    formData.append("email", document.getElementById("user-email").value || '');
    formData.append("phone", document.getElementById("user-phone").value || '');
    formData.append("address", document.getElementById("user-address").value || '');
    formData.append("role", document.getElementById("user-role").value || '');

    const fileInput = document.getElementById('user-avatar');
    if (fileInput.files[0]) {
        formData.append("image", fileInput.files[0]);
    }

    axios.post(`http://localhost:5050/member/update/${memberId}`, formData, { headers })
        .then(response => {
            console.log('Member updated successfully:', response.data);
            window.location.href = 'adminmember.html';
        })
        .catch(error => {
            console.error('Error updating member details:', error);
            if (error.response && error.response.status === 403) {
                alert('Access forbidden: Invalid token or insufficient permissions.');
            } else if (error.response && error.response.status === 400) {
                alert('Bad Request: Please check the input values.');
            }
        });
}

document.getElementById('updateUserForm').addEventListener('submit', updateUser);

function cancelEdit() {
    window.location.href = 'adminmember.html';
}

