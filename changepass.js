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

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới có khớp không
        if (newPassword !== confirmNewPassword) {
            showModal('Thất bại', 'Mật khẩu mới và xác nhận mật khẩu mới không khớp.');
            return;
        }

        // Kiểm tra độ dài mật khẩu mới (ví dụ yêu cầu ít nhất 8 ký tự)
        if (newPassword.length < 8) {
            showModal('Thất bại', 'Mật khẩu mới phải có ít nhất 8 ký tự.');
            return;
        }

        // Kiểm tra mật khẩu mới có chứa các ký tự đặc biệt, chữ hoa, chữ thường và số không (Ví dụ: yêu cầu mật khẩu phức tạp)
        const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordStrengthRegex.test(newPassword)) {
            showModal('Thất bại', 'Mật khẩu mới phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt.');
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
                showModal('Thành công', 'Đổi mật khẩu thành công!');
            } else {
                showModal('Thất bại', 'Đổi mật khẩu thất bại. Mật khẩu không đúng!');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            showModal('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    });

    function showModal(title, message) {
        // Cập nhật nội dung modal
        document.getElementById('changePasswordModalLabel').textContent = title;
        document.getElementById('modalMessage').textContent = message;

        // Hiển thị modal
        $('#changePasswordModal').modal('show');
    }
});
