// Chuyển đổi ngày từ định dạng yyyy-mm-dd sang ngày-tháng-tên tháng-năm
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
function convertToEnglishDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// Cắt chuỗi thời gian để lấy giờ và phút
function formatStartTime(startTime) {
    return startTime.substring(0, 5);
}

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movie_id');

// Lấy dữ liệu từ API và xử lý hiển thị thông tin phim và lịch chiếu
axios.get(`http://localhost:5050/showtimes/movie/${movieId}`)
    .then(response => {
        const movieData = response.data[0].movie; // Lấy thông tin về phim từ dữ liệu API
        const showtimes = response.data; // Lấy thông tin về lịch chiếu từ dữ liệu API

        // Hiển thị thông tin cơ bản về phim bên trái
        const movieInfoContainer = document.getElementById('movieInfoContainer');

        const h2 = document.createElement('h2');
        h2.textContent = movieData.name;
        movieInfoContainer.appendChild(h2);

        const img = document.createElement('img');
        img.src = './image cinema/' + movieData.image;
        img.alt = movieData.name;
        img.width = 300;
        img.height = 400;
        movieInfoContainer.appendChild(img);

        const pDuration = document.createElement('p');
        pDuration.textContent = `Thời lượng: ${movieData.duration} phút`;
        movieInfoContainer.appendChild(pDuration);

        const pRated = document.createElement('p');
        pRated.textContent = `Giá phim: ${movieData.price}`;
        movieInfoContainer.appendChild(pRated);

        const pActor = document.createElement('p');
        pActor.textContent = `Diễn viên: ${movieData.actor}`;
        movieInfoContainer.appendChild(pActor);

        // Hiển thị danh sách lịch chiếu bên phải
        const showDayContainer = document.getElementById('showDayContainer');
        const uniqueDates = new Set();

        // Thêm sự kiện click vào mỗi thẻ lịch chiếu
        showtimes.forEach(showtime => {
            const date = showtime.schedule.day_time.day_time;

            if (!uniqueDates.has(date)) {
                uniqueDates.add(date);

                const showDayElement = document.createElement('div');
                showDayElement.classList.add('show-day');

                const h2 = document.createElement('h2');
                h2.textContent = convertToEnglishDate(date);
                showDayElement.appendChild(h2);

                showtimes.forEach(showtime => {
                    if (showtime.schedule.day_time.day_time === date) {
                        const showTimeElement = document.createElement('div');
                        showTimeElement.classList.add('show-time');

                        var p = document.createElement('p');
                        p.textContent = formatStartTime(showtime.schedule.startTime);
                        showTimeElement.appendChild(p);

                        // Thêm sự kiện click vào thẻ lịch chiếu
                        showTimeElement.addEventListener('click', function () {
                            navigateToSeatSelection(showtime.id); // Sử dụng thuộc tính id của showtime
                        });

                        showDayElement.appendChild(showTimeElement);
                    }
                });

                showDayContainer.appendChild(showDayElement);
            }
        });

        // Hàm chuyển hướng trang sang trang danh sách ghế với id của lịch chiếu
        function navigateToSeatSelection(showtimeId) {
            window.location.href = `list.html?showtimeId=${showtimeId}`;
            console.log(showtimeId);
            alert(`showtimeId: ${showtimeId}`);
        }

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
