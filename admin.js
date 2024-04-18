function editMovie(movieId) {
    window.location.href = `edit.html?movieId=${movieId}`;
    console.log(movieId);
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
    axios.get('http://localhost:5050/movie/all', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            const movies = response.data;
            const movieListContainer = document.getElementById('movieList');

            const moviesPerPage = 8;
            let currentPage = 1;

            // Hàm để hiển thị phim trên trang cụ thể
            function displayMoviesOnPage(page) {
                movieListContainer.innerHTML = ''; // Xóa nội dung cũ

                const startIndex = (page - 1) * moviesPerPage;
                const endIndex = startIndex + moviesPerPage;
                const moviesOnPage = movies.slice(startIndex, endIndex);

                // Trong hàm displayMoviesOnPage

                moviesOnPage.forEach(movie => {
                    const movieListItem = document.createElement('li');
                    movieListItem.classList.add('movie-item');
                    movieListItem.id = `movie-${movie.id}`;

                    movieListItem.innerHTML = `
        <div>
            <img src="./image cinema/${movie.image}" alt="${movie.name}">
        </div>
        <div class="movie-details">
            <h3>${movie.name}</h3>
            <p>Thể loại: ${movie.category}</p>
            <p>Thời lượng: ${movie.duration} phút</p>
            <p>Khởi chiếu: ${new Date(movie.start_date).toLocaleDateString()}</p>
            <p>Đạo diễn: ${movie.director}</p>
            <p>Diễn viên: ${movie.actor ? movie.actor : 'Không có thông tin'}</p>
            <p>Giá vé: ${movie.price} VNĐ</p>
            <a href="#" class="btn btn-primary trailer-link" data-trailer-url="./video cinema/${movie.trailer}">Xem trailer</a>
        </div>
        <div class="btn-group">
            <a href="#" class="btn btn-primary" onclick="editMovie(${movie.id})">Chỉnh sửa</a>
            <a href="#" class="btn btn-danger" onclick="deleteMovie(${movie.id})">Xóa</a>
        </div>
    `;

                    const trailerLink = movieListItem.querySelector('.trailer-link');
                    trailerLink.addEventListener('click', function (event) {
                        event.preventDefault();

                        const trailerUrl = this.getAttribute('data-trailer-url');
                        const trailerIframe = document.getElementById('trailerVideo');
                        trailerIframe.src = trailerUrl;

                        const modal = document.getElementById('trailerModal');
                        modal.style.display = 'block';

                        const closeBtn = modal.querySelector('.close');
                        closeBtn.addEventListener('click', function () {
                            modal.style.display = 'none';
                        });
                    });

                    movieListContainer.appendChild(movieListItem);
                });

            }

            // Hiển thị trang đầu tiên khi trang được tải
            displayMoviesOnPage(currentPage);

            // Thêm các nút hoặc liên kết để chuyển qua các trang khác nhau
            const paginationContainer = document.querySelector('.pagination');
            for (let i = 1; i <= Math.ceil(movies.length / moviesPerPage); i++) {
                const pageLink = document.createElement('a');
                pageLink.href = '#';
                pageLink.textContent = i;

                if (i === currentPage) {
                    pageLink.classList.add('active');
                }

                pageLink.addEventListener('click', () => {
                    currentPage = i;
                    displayMoviesOnPage(currentPage);

                    // Xóa lớp active của các liên kết khác và thêm vào liên kết được chọn
                    const allPageLinks = paginationContainer.querySelectorAll('a');
                    allPageLinks.forEach(link => link.classList.remove('active'));
                    pageLink.classList.add('active');
                });

                paginationContainer.appendChild(pageLink);
            }
        })
        .catch(error => {
            console.error('Error fetching movie list:', error);
        });



    // Hàm gọi API tìm kiếm phim

    function deleteMovie(movieId) {
        // Lấy token từ local storage
        const token = localStorage.getItem('token');

        // Kiểm tra nếu không có token, không gửi yêu cầu và thông báo lỗi
        if (!token) {
            console.error('Token not found!');
            return;
        }

        // Gửi yêu cầu DELETE đến API để xóa bộ phim với movieId được truyền vào
        axios.post(`http://localhost:5050/movie/delete/${movieId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token trong header cho xác thực
            }
        })
            .then(response => {
                console.log("movies", movieId);
                // Xóa thành công, cập nhật thông báo và hiển thị trên giao diện người dùng
                const deleteMessage = document.getElementById('deleteMessage');
                deleteMessage.innerText = 'Xóa phim thành công.';
                deleteMessage.classList.remove('hidden'); // Hiển thị thông báo

                const movieToRemove = document.getElementById(`movie-${movieId}`);
                movieToRemove.style.opacity = '0.5'; // Áp dụng hiệu ứng mờ dần

                // Xóa phim sau 1 giây
                setTimeout(() => {
                    movieToRemove.remove();
                }, 1000);
                // Mờ dần và biến mất thông báo sau 2 giây
                setTimeout(() => {
                    deleteMessage.classList.add('hidden');
                }, 1000);
            })
            .catch(error => {
                // Xử lý lỗi nếu có
                console.error('Error deleting movie:', error);
            });
    }


}
