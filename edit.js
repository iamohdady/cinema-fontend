// window.onload = function() {
//     // Lấy thông tin của bộ phim từ URL parameters
//     const params = new URLSearchParams(window.location.search);
//     const movieId = params.get('movieId');

//     const token = localStorage.getItem('token'); // Lấy token từ localStorage
//     const username = localStorage.getItem('username'); // Giả sử bạn cũng lưu username trong localStorage khi đăng nhập thành công

//     if (token && username) {
//         // Ẩn các mục "Đăng nhập" và "Đăng ký"
//         document.getElementById('nav-login').style.display = 'none';
//         document.getElementById('nav-register').style.display = 'none';

//         // Hiển thị câu chào mừng người dùng
//         document.getElementById('nav-welcome').style.display = 'block';
//         document.getElementById('username').textContent = username;
//     }
//     console.log('Token:', token);
//     console.log(movieId);

//     // Kiểm tra nếu không có token, không gửi yêu cầu
//     if (!token) {
//         console.error('Token not found!');
//         return;
//     }

//     // Tạo header Authorization từ token
//     const headers = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//     };

//     // Gửi yêu cầu lấy thông tin của bộ phim từ máy chủ
//     axios.get(`http://localhost:5050/movie/${movieId}`, { headers })
//         .then(response => {
//             // Nhận được thông tin của bộ phim
//             const movie = response.data;

//             // Điền thông tin của bộ phim vào các trường chỉnh sửa tương ứng
//             document.getElementById('movie-title').value = movie.name;
//             document.getElementById('movie-genre').value = movie.category;
//             document.getElementById('movie-duration').value = movie.duration;
//             document.getElementById('movie-release-date').value = movie.start_date.substring(0, 10);
//             document.getElementById('movie-director').value = movie.director;
//             document.getElementById('movie-actor').value = movie.actor;
//             document.getElementById('movie-price').value = movie.price;
//             if (movie.image) {
//                 document.getElementById('preview-image').src = `./image cinema/${movie.image}`;
//             }
//             if (movie.trailer) {
//                 const fileName = movie.trailer.split('/').pop();
//                 document.getElementById('movie-trailer').innerHTML = fileName;
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching movie details:', error);
//         });

//     // Gán sự kiện submit cho form chỉnh sửa
//     const updateForm = document.getElementById('update-form');
//     updateForm.addEventListener('submit', function(event) {
//         event.preventDefault(); // Ngăn chặn gửi yêu cầu form mặc định

//         // Lấy dữ liệu từ các trường chỉnh sửa
//         const updatedMovieData = {
//             name: document.getElementById('movie-title').value,
//             category: document.getElementById('movie-genre').value,
//             duration: document.getElementById('movie-duration').value,
//             start_date: document.getElementById('movie-release-date').value,
//             director: document.getElementById('movie-director').value,
//             actor: document.getElementById('movie-actor').value,
//             price: document.getElementById('movie-price').value,
//             image: document.getElementById('movie-image').files[0], // Lấy file ảnh từ input
//             trailer: document.getElementById('movie-trailer').files[0]
//             //Thêm các trường khác nếu cần thiết
//         };

//         // Gửi yêu cầu cập nhật thông tin phim
//         axios.post(`http://localhost:5050/movie/update/${movieId}`, updatedMovieData, { headers: {
//             'Authorization': `Bearer ${token}`
//         }})
//             .then(response => {
//                 // Xử lý kết quả thành công, thông báo cho người dùng và chuyển hướng về trang danh sách phim
//                 console.log('Movie updated successfully:', response.data);
//                 alert('Thông tin phim đã được cập nhật thành công!');
//                 window.location.href = 'admin.html';
//             })
//             .catch(error => {
//                 // Xử lý lỗi nếu có
//                 console.error('Error updating movie:', error);
//                 console.log(updatedMovieData);
//                 alert('Có lỗi xảy ra khi cập nhật thông tin phim. Vui lòng thử lại sau.');
//             });
//     });
// };

// function cancelEdit() {
//     // Redirect back to the list of movies page
//     window.location.href = 'admin.html';
// }

// document.getElementById('movie-trailer').addEventListener('change', function () {
//     const file = this.files[0];
//     if (file) {
//         const fileName = file.name;
//         const label = document.getElementById('movie-trailer');
//         label.innerHTML = fileName;
//     }
// });

// function clearTrailer() {
//     // Clear the selected file
//     const input = document.getElementById('movie-trailer');
//     input.value = '';
//     // Update the label to show default text
//     const label = document.getElementById('movie-trailer');
//     label.innerHTML = 'Chọn file';
// }


// // Xử lý sự kiện khi chọn ảnh
// document.getElementById("movie-image").addEventListener("change", function () {
//     // Hiển thị ảnh xem trước
//     var file = this.files[0];
//     if (file) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             document.getElementById("preview-image").setAttribute("src", e.target.result);
//         }
//         reader.readAsDataURL(file);
//     }
// });

// // Xử lý sự kiện khi chọn trailer
// document.getElementById("movie-trailer").addEventListener("change", function () {
//     // Hiển thị video xem trước
//     var file = this.files[0];
//     if (file) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             var video = document.getElementById("preview-video");
//             video.style.display = "block";
//             video.setAttribute("src", e.target.result);
//         }
//         reader.readAsDataURL(file);
//     }
// });
window.onload = function () {
    // Lấy thông tin của bộ phim từ URL parameters
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('movieId');

    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const username = localStorage.getItem('username'); // Giả sử bạn cũng lưu username trong localStorage khi đăng nhập thành công

    if (token && username) {
        // Ẩn các mục "Đăng nhập" và "Đăng ký"
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';

        // Hiển thị câu chào mừng người dùng
        document.getElementById('nav-welcome').style.display = 'block';
        document.getElementById('username').textContent = username;
    }
    console.log('Token:', token);
    console.log(movieId);

    // Kiểm tra nếu không có token, không gửi yêu cầu
    if (!token) {
        console.error('Token not found!');
        return;
    }

    // Tạo header Authorization từ token
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // Sử dụng multipart/form-data cho FormData
    };

    // Gửi yêu cầu lấy thông tin của bộ phim từ máy chủ
    axios.get(`http://localhost:5050/movie/${movieId}`, { headers })
        .then(response => {
            // Nhận được thông tin của bộ phim
            const movie = response.data;

            // Điền thông tin của bộ phim vào các trường chỉnh sửa tương ứng
            document.getElementById('movie-title').value = movie.name;
            document.getElementById('movie-genre').value = movie.category;
            document.getElementById('movie-duration').value = movie.duration;
            document.getElementById('movie-release-date').value = movie.start_date.substring(0, 10);
            document.getElementById('movie-director').value = movie.director;
            document.getElementById('movie-actor').value = movie.actor;
            document.getElementById('movie-price').value = movie.price;
            if (movie.image) {
                document.getElementById('preview-image').src = `./image cinema/${movie.image}`;
            }
            if (movie.trailer) {
                const fileName = movie.trailer.split('/').pop();
                document.getElementById('movie-trailer').innerHTML = fileName;
            }
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });

    // Gán sự kiện submit cho form chỉnh sửa
    // Gán sự kiện submit cho form chỉnh sửa
    const updateForm = document.getElementById('update-form');
    updateForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn chặn gửi yêu cầu form mặc định

        // Tạo FormData để chứa dữ liệu cập nhật
        const formData = new FormData();

        // Lấy dữ liệu từ các trường chỉnh sửa và thêm vào FormData
        formData.append('name', document.getElementById('movie-title').value);
        formData.append('category', document.getElementById('movie-genre').value);
        formData.append('duration', document.getElementById('movie-duration').value);
        formData.append('start_date', document.getElementById('movie-release-date').value);
        formData.append('director', document.getElementById('movie-director').value);
        formData.append('actor', document.getElementById('movie-actor').value);
        formData.append('price', document.getElementById('movie-price').value);
        formData.append('image', document.getElementById('movie-image').files[0]);
        formData.append('trailer', document.getElementById('movie-trailer').files[0]);

        // Gửi yêu cầu cập nhật thông tin phim
        axios.post(`http://localhost:5050/movie/update/${movieId}`, formData, { headers })
            .then(response => {
                // Xử lý kết quả thành công, thông báo cho người dùng và chuyển hướng về trang danh sách phim
                console.log('Movie updated successfully:', response.data);
                alert('Thông tin phim đã được cập nhật thành công!');
                window.location.href = 'admin.html';
            })
            .catch(error => {
                // Xử lý lỗi nếu có
                console.error('Error updating movie:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin phim. Vui lòng thử lại sau.');
            });
    });
};
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

