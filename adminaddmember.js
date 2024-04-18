document.addEventListener("DOMContentLoaded", function () {
    // Lấy token từ Local Storage hoặc nơi lưu trữ khác
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

    // Hiển thị token trong console
    console.log("Token:", token);

    // Xử lý sự kiện khi form được gửi đi
    document.getElementById("addUserForm").addEventListener("submit", function (event) {
        // Ngăn chặn hành động mặc định của form
        event.preventDefault();

        // Tạo FormData object để gửi dữ liệu
        var formData = new FormData();

        // Lấy giá trị của các trường input
        var userFullname = document.getElementById("user-fullname").value;
        var userUsername = document.getElementById("user-username").value;
        var userPassword = document.getElementById("user-password").value;
        var userBirthday = document.getElementById("user-birthday").value;
        var userEmail = document.getElementById("user-email").value;
        var userPhone = document.getElementById("user-phone").value;
        var userAddress = document.getElementById("user-address").value;
        var userRole = document.getElementById("user-role").value;

        // Lấy file ảnh
        var userImage = document.getElementById("user-avatar").files[0];

        // Kiểm tra xem người dùng đã chọn tệp tin ảnh hay chưa
        if (userImage) {
            // Nếu đã chọn, thêm vào FormData
            formData.append("image", userImage);
            // Tiếp tục xử lý và gửi yêu cầu
        } else {
            // Nếu không chọn, hiển thị thông báo hoặc xử lý theo ý bạn
            console.error("Error: Please select an image file");
            return; // Thoát khỏi sự kiện nếu không chọn tệp tin ảnh
        }

        // Thêm các giá trị còn lại vào FormData
        formData.append("fullname", userFullname);
        formData.append("username", userUsername);
        formData.append("password", userPassword);
        formData.append("birthday", userBirthday);
        formData.append("email", userEmail);
        formData.append("phone", userPhone);
        formData.append("address", userAddress);
        formData.append("role", userRole);

        // Gửi request tới server sử dụng Axios
        axios.post("http://localhost:5050/member/add", formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                // Xử lý khi request thành công
                console.log("Success:", response.data);
                // Hiển thị thông báo thành công
                document.getElementById("message").innerHTML = "<div class='alert alert-success'>Thêm thành viên thành công!</div>";
                // Chuyển hướng sang trang admin.html
                window.location.href = "adminmember.html";
            })
            .catch(function (error) {
                // Xử lý khi request gặp lỗi
                console.error("Error:", error);
                // Hiển thị thông báo lỗi
                document.getElementById("message").innerHTML = "<div class='alert alert-danger'>Thêm thành viên thất bại!</div>";
            });
    });

    // Xử lý sự kiện khi chọn ảnh
    document.getElementById("user-avatar").addEventListener("change", function () {
        // Hiển thị ảnh xem trước
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("preview-avatar").setAttribute("src", e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
});
