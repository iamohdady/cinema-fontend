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
    document.getElementById("addMovieForm").addEventListener("submit", function (event) {
        // Ngăn chặn hành động mặc định của form
        event.preventDefault();

        // Tạo FormData object để gửi dữ liệu
        var formData = new FormData();

        // Lấy giá trị của các trường input
        var movieTitle = document.getElementById("movie-title").value;
        var movieGenre = document.getElementById("movie-genre").value;
        var movieReleaseDate = document.getElementById("movie-release-date").value;
        var movieDuration = document.getElementById("movie-duration").value;
        var movieDirector = document.getElementById("movie-director").value;
        var movieActor = document.getElementById("movie-actor").value;
        var moviePrice = document.getElementById("movie-price").value;

        // Lấy file ảnh và trailer
        var movieImage = document.getElementById("movie-image").files[0];
        var movieTrailer = document.getElementById("movie-trailer").files[0];

        // Kiểm tra xem người dùng đã chọn tệp tin ảnh và trailer hay chưa
        if (movieImage && movieTrailer) {
            // Nếu đã chọn, thêm vào FormData
            formData.append("image", movieImage);
            formData.append("trailer", movieTrailer);

            // Tiếp tục xử lý và gửi yêu cầu
        } else {
            // Nếu không chọn, hiển thị thông báo hoặc xử lý theo ý bạn
            console.error("Error: Please select both image and trailer files");
            return; // Thoát khỏi sự kiện nếu không chọn tệp tin ảnh và trailer
        }

        // Thêm các giá trị còn lại vào FormData
        formData.append("name", movieTitle);
        formData.append("start_date", movieReleaseDate);
        formData.append("duration", movieDuration);
        formData.append("category", movieGenre);
        formData.append("director", movieDirector);
        formData.append("actor", movieActor);
        formData.append("price", moviePrice);

        // Gửi request tới server sử dụng Axios
        axios.post("http://localhost:5050/movie/add", formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                // Xử lý khi request thành công
                console.log("Success:", response.data);
                // Hiển thị thông báo thành công
                document.getElementById("message").innerHTML = "<div class='alert alert-success'>Thêm phim thành công!</div>";
                // Chuyển hướng sang trang admin.html
                window.location.href = "admin.html";
            })
            .catch(function (error) {
                // Xử lý khi request gặp lỗi
                console.error("Error:", error);
                // Hiển thị thông báo lỗi
                document.getElementById("message").innerHTML = "<div class='alert alert-danger'>Thêm phim thất bại!</div>";
            });
    });

    // Xử lý sự kiện khi chọn ảnh
    document.getElementById("movie-image").addEventListener("change", function () {
        // Hiển thị ảnh xem trước
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("preview-image").setAttribute("src", e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // Xử lý sự kiện khi chọn trailer
    document.getElementById("movie-trailer").addEventListener("change", function () {
        // Hiển thị video xem trước
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var video = document.getElementById("preview-video");
                video.style.display = "block";
                video.setAttribute("src", e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
});

// Hàm xóa trailer
function clearTrailer() {
    var video = document.getElementById("preview-video");
    video.style.display = "none";
    video.removeAttribute("src");
}
