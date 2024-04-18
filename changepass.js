document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username'); 

    if (token && username) {
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';

        document.getElementById('nav-welcome').style.display = 'block';
        document.getElementById('username').textContent = username;
        document.getElementById('fullname').textContent = username; 
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    const messageDiv = document.getElementById('message');

    changePasswordForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            messageDiv.textContent = 'Mật khẩu mới và xác nhận mật khẩu mới không khớp.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await axios.post('http://localhost:5050/member/update_password', {
                username: username,
                old_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data === 'SUCCESS') {
                messageDiv.textContent = 'Đổi mật khẩu thành công!';
                messageDiv.style.color = 'green';
            } else {
                messageDiv.textContent = 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            messageDiv.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            messageDiv.style.color = 'red';
        }
    });
});
