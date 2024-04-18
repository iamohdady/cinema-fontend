// Số lượng phim trên mỗi trang
const moviesPerPage = 12;
let currentPage = 1;
let totalPages = 1;

function fetchMovies() {
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

    // Kiểm tra nếu không có token, không gửi yêu cầu
    if (!token) {
        console.error('Token not found!');
        return;
    }

    // Tạo header Authorization từ token
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Gửi yêu cầu GET đến API danh sách phim với header Authorization
    axios.get('http://localhost:5050/movie/upcoming', { headers })
        .then(response => {
            const data = response.data;
            console.log(data);
            const container = document.getElementById('container');
            container.innerHTML = '';

            // Tính toán tổng số trang
            totalPages = Math.ceil(data.length / moviesPerPage);

            // Hiển thị chỉ một phần của danh sách phim tương ứng với trang hiện tại
            const startIndex = (currentPage - 1) * moviesPerPage;
            const endIndex = startIndex + moviesPerPage;
            const moviesToShow = data.slice(startIndex, endIndex);

            // Tạo các movie-card cho các bộ phim được hiển thị
            const grid = document.createElement('div');
            grid.classList.add('grid');
            moviesToShow.forEach(movie => {
                const movieCard = createMovieCard(movie);
                grid.appendChild(movieCard);
            });
            container.appendChild(grid);

            // Hiển thị các nút phân trang
            displayPagination();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayPagination() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.textContent = '<Previous';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies();
        }
    });
    pagination.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('a');
        pageButton.href = '#';
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchMovies();
        });
        pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.textContent = 'Next>';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchMovies();
        }
    });
    pagination.appendChild(nextButton);
}

// Hàm tạo một movie-card mới
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.setAttribute('data-id', movie.id); // Thêm ID vào phần tử DOM

    const image = document.createElement('img');
    image.src = './image cinema/' + movie.image;
    image.alt = movie.name;
    image.classList.add('movie-image');
    movieCard.appendChild(image);

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');

    const title = document.createElement('h3');
    title.textContent = movie.name;
    movieInfo.appendChild(title);

    const genre = document.createElement('p');
    genre.textContent = 'Thể loại: ' + movie.category;
    movieInfo.appendChild(genre);

    const duration = document.createElement('p');
    duration.textContent = 'Thời lượng: ' + movie.duration + ' phút';
    movieInfo.appendChild(duration);

    const releaseDate = document.createElement('p');
    releaseDate.textContent = 'Khởi chiếu: ' + new Date(movie.start_date).toLocaleDateString();
    movieInfo.appendChild(releaseDate);

    const buyButton = document.createElement('a');
    buyButton.href = '#';
    buyButton.textContent = 'MUA VÉ';
    movieInfo.appendChild(buyButton);
    buyButton.addEventListener('click', function () {
        window.location.href = 'schedule.html?movie_id=' + movie.id;
    });

    const detailButton = document.createElement('a');
    detailButton.href = 'detail.html?movie_id=' + movie.id;
    detailButton.classList.add('other-button');
    detailButton.textContent = 'CHI TIẾT';
    movieInfo.appendChild(detailButton);

    movieCard.appendChild(movieInfo);

    return movieCard;
}

document.addEventListener('DOMContentLoaded', function() {
    fetchMovies();
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('movie-card')) {
        const movieId = event.target.getAttribute('data-id');
        console.log('ID của bộ phim:', movieId);
    }
});

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const keyword = document.getElementById('search-input').value.trim();
    if (keyword !== '') {
        searchMovies(keyword);
    }
});

function searchMovies(keyword) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token not found!');
        return;
    }

    fetch(`http://localhost:5050/movie/search/${keyword}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayMovies(data);
    })
    .catch(error => {
        console.error('There was a problem with the search operation:', error);
    });
}

function displayMovies(movies) {
    
    const container = document.getElementById('container');
    container.innerHTML = ''; 
    
    const grid = document.createElement('div');
    grid.classList.add('grid');

    if (Array.isArray(movies)) {
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            grid.appendChild(movieCard);
        });
    } else { 
        const movieCard = createMovieCard(movies);
        grid.appendChild(movieCard);
    }

    container.appendChild(grid);
}

function searchMovies(keyword) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token not found!');
        return;
    }

    fetch(`http://localhost:5050/movie/search/key`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: keyword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayMovies(data);
    })
    .catch(error => {
        console.error('There was a problem with the search operation:', error);
    });
}

function displayMovies(movies) {    
    const container = document.getElementById('container');
    container.innerHTML = ''; 
    
    const grid = document.createElement('div');
    grid.classList.add('grid');

    if (Array.isArray(movies)) {
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            grid.appendChild(movieCard);
        });
    } else { 
        const movieCard = createMovieCard(movies);
        grid.appendChild(movieCard);
    }

    container.appendChild(grid);
}


