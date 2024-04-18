function fetchMovieDetails(movieId) {
    fetch(`http://localhost:5050/movie/details/${movieId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            // Cập nhật nội dung của trang HTML dựa trên dữ liệu nhận được
            document.querySelector('.movie-title').textContent = data.name;
            document.querySelector('.movie-name').textContent = data.name;
            document.querySelector('.director').textContent = data.director;
            document.querySelector('.actor').textContent = data.actor;
            document.querySelector('.genre').textContent = data.category;
            document.querySelector('.language').textContent = data.languages;
            document.querySelector('.duration').textContent = data.duration;
            const releaseDate = new Date(data.start_date);
            // Format lại ngày tháng năm theo định dạng dd/mm/yyyy
            const formattedReleaseDate = releaseDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
            document.querySelector('.release-date').textContent = formattedReleaseDate;
            
            // Đặt đường dẫn của ảnh phim
            const moviePoster = document.querySelector('.img-fluid');
            moviePoster.src = `./image cinema/${data.image}`;
            moviePoster.alt = data.image;

            // Đặt đường dẫn cho nút MUA VÉ
            const buyTicketButton = document.querySelector('.btn-primary');
            buyTicketButton.href = `schedule.html?movie_id=${data.id}`; // Thay đổi đường dẫn tùy theo cần thiết

            // Cập nhật đường dẫn trailer
            // const trailerButton = document.querySelector('.btn-secondary');
            // trailerButton.href = `./video cinema/${data.trailer}`;
             // Hiển thị video trailer
             const trailerContainer = document.querySelector('.trailer-container');
             const videoElement = document.createElement('video');
             videoElement.controls = true;
             videoElement.className = 'img-fluid mt-4';
             const sourceElement = document.createElement('source');
             sourceElement.src = `./video cinema/${data.trailer}`;
             sourceElement.type = 'video/mp4';
             videoElement.appendChild(sourceElement);
             trailerContainer.appendChild(videoElement);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Gọi hàm fetchMovieDetails khi trang HTML đã được tải
document.addEventListener('DOMContentLoaded', function() {
    // Lấy ID của phim từ query string (URL)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieId = urlParams.get('movie_id');

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
    
    fetchMovieDetails(movieId);
});


