function editMember(memberId) {
    window.location.href = `adminupdatemember.html?memberId=${memberId}`;
}
const token = localStorage.getItem('token');
const username = localStorage.getItem('username'); // Giả sử bạn cũng lưu username trong localStorage khi đăng nhập thành công

if (token && username) {
    // Ẩn các mục "Đăng nhập" và "Đăng ký"
    document.getElementById('nav-login').style.display = 'none';
    document.getElementById('nav-register').style.display = 'none';

    // Hiển thị câu chào mừng người dùng
    document.getElementById('nav-welcome').style.display = 'block';
    document.getElementById('username').textContent = username;
}
if (token) {
    // Gửi yêu cầu GET đến API
    axios.get('http://localhost:5050/member/all', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {
            // Xử lý dữ liệu nhận được từ API
            const userList = document.getElementById('userList');

            // Lặp qua mỗi người dùng trong danh sách
            response.data.forEach(function (user) {
                // Tạo một mục người dùng mới
                const userItem = document.createElement('li');
                userItem.classList.add('user-item');
                userItem.id = `member-${user.id}`;

                // HTML của mục người dùng
                if (user.image) {
                    userItem.innerHTML = `
                    <div class="user-image">
                        <img src="./image cinema/${user.image}" alt="Avatar">
                    </div>
                    <div class="user-details">
                        <h3>${user.fullname}</h3>
                        <p><strong>Tên sử dụng:</strong> ${user.username}</p>
                        <p><strong>Sinh nhật:</strong> ${user.birthday}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Địa chỉ:</strong> ${user.address}</p>
                        <p><strong>Điện thoại:</strong> ${user.phone}</p>
                        <p><strong>Vai trò:</strong> ${user.role}</p>
                        <p><strong>Số tiền:</strong> ${user.money}</p>
                    </div>
                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary btn-block mb-2">Thêm</button>
                        <button type="button" class="btn btn-secondary btn-block mb-2" onclick="editMember(${user.id})">Sửa</button>
                        <button type="button" class="btn btn-danger btn-block" onclick="deleteMember(${user.id})">Xóa</button>
                        `;
                }

                // Thêm mục người dùng vào danh sách người dùng
                userList.appendChild(userItem);
            });
        })
        .catch(function (error) {
            console.log(error);
        });

    function deleteMember(memberId) {
        // Lấy token từ local storage
        const token = localStorage.getItem('token');

        // Kiểm tra nếu không có token, không gửi yêu cầu và thông báo lỗi
        if (!token) {
            console.error('Token not found!');
            return;
        }

        // Gửi yêu cầu DELETE đến API để xóa thành viên với memberId được truyền vào
        axios.post(`http://localhost:5050/member/delete/${memberId}`, null, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token trong header cho xác thực
            }
        })
            .then(response => {
                // Xóa thành công, cập nhật thông báo và hiển thị trên giao diện người dùng
                const deleteMessage = document.getElementById('deleteMessage');
                deleteMessage.innerText = 'Xóa thành viên thành công.';
                deleteMessage.classList.remove('hidden'); // Hiển thị thông báo

                const memberToRemove = document.getElementById(`member-${memberId}`);
                if (memberToRemove) {
                    memberToRemove.style.opacity = '0.5'; // Áp dụng hiệu ứng mờ dần
                    // Tiếp tục với việc xóa phần tử và hiển thị thông báo
                    // Xóa phim sau 1 giây
                    setTimeout(() => {
                        memberToRemove.remove();
                    }, 1000);
                    console.log(memberId);

                } else {
                    console.log(memberId);

                    console.error('Member to remove not found!');
                }

                // Mờ dần và biến mất thông báo sau 2 giây
                setTimeout(() => {
                    deleteMessage.classList.add('hidden');
                }, 2000);
            })
            .catch(error => {
                // Xử lý lỗi nếu có
                console.error('Error deleting member:', error);
            });
    }



}

