document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    const username = localStorage.getItem('username');

    if (token && username) {
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';

        document.getElementById('nav-welcome').style.display = 'block';
        document.getElementById('username').textContent = username;
    }


    updateDashboardData();
});

async function updateDashboardData() {
    try {
        const [membersResponse, moviesResponse, revenueResponse] = await Promise.all([
            axios.get('http://localhost:5050/member/count'),
            axios.get('http://localhost:5050/movie/count'),
            axios.get('http://localhost:5050/revenue/today')
        ]);

        document.getElementById('totalMembers').innerText = membersResponse.data;
        document.getElementById('totalMovies').innerText = moviesResponse.data;
        document.getElementById('totalRevenue').innerText = revenueResponse.data;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        fetchDailyRevenueByMonth(currentYear, currentMonth);

        fetchMonthlyRevenueByYear(currentYear);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bảng điều khiển:', error);
    }
}

// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Mặc định hiển thị dữ liệu
    const today = new Date();
    const formattedDate = formatDate(today); // yyyy-MM-dd
    const formattedMonth = formatMonth(today); // yyyy-MM

    // Gán giá trị mặc định cho input ngày và tháng
    document.getElementById('selectedDate').value = formattedDate;
    document.getElementById('selectedMonth').value = formattedMonth;

    // Gọi các hàm hiển thị dữ liệu
    fetchMonthlyRevenue(today.getFullYear());
    fetchDailyRevenueByMonth(today.getFullYear(), today.getMonth() + 1);
    fetchDailyRevenueByMovieAndDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
});

// --- Biểu đồ doanh thu theo tháng ---
async function fetchMonthlyRevenue(year) {
    try {
        const response = await fetch(`http://localhost:5050/revenue/monthly-by-year?year=${year}`);
        const data = await response.json();

        const labels = Object.keys(data); // Các tháng
        const values = Object.values(data); // Doanh thu từng tháng

        renderChart('monthlyRevenueChart', 'line', 'Doanh thu theo tháng', labels, values);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu theo tháng:', error);
        showErrorMessage('Có lỗi xảy ra khi tải dữ liệu doanh thu theo tháng.');
    }
}

// --- Biểu đồ doanh thu theo ngày ---
async function fetchDailyRevenueByMonth(year, month) {
    try {
        const response = await fetch(`http://localhost:5050/revenue/daily-by-month?year=${year}&month=${month}`);
        const data = await response.json();

        const labels = Object.keys(data); // Các ngày
        const values = Object.values(data); // Doanh thu từng ngày

        renderChart('dailyRevenueChart', 'bar', 'Doanh thu theo ngày', labels, values);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu theo ngày:', error);
        showErrorMessage('Có lỗi xảy ra khi tải dữ liệu doanh thu theo ngày.');
    }
}

// --- Biểu đồ doanh thu theo từng phim ---
async function fetchDailyRevenueByMovieAndDate(year, month, day) {
    try {
        const formattedDate = formatDate(new Date(year, month - 1, day)); // yyyy-MM-dd
        const response = await fetch(`http://localhost:5050/revenue/movie-and-date`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentTime: formattedDate
            })
        });

        const data = await response.json();
        const labels = data.map(item => item.movieName); // Tên phim
        const values = data.map(item => item.totalRevenue); // Doanh thu từng phim

        renderChart('movieRevenueChart', 'pie', 'Doanh thu theo từng phim', labels, values);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu từng phim:', error);
        showErrorMessage('Có lỗi xảy ra khi tải dữ liệu doanh thu từng phim.');
    }
}

// --- Các sự kiện chọn ngày/tháng ---
document.getElementById('selectedMonth').addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    if (!isNaN(year) && !isNaN(month)) {
        fetchDailyRevenueByMonth(year, month);
    } else {
        console.error('Tháng không hợp lệ:', month);
    }
});

document.getElementById('selectedDate').addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        fetchDailyRevenueByMovieAndDate(year, month, day);
    } else {
        console.error('Ngày không hợp lệ:', day);
    }
});

// --- Hàm render biểu đồ ---
function renderChart(canvasId, chartType, label, labels, data) {
    destroyChart(canvasId); // Xóa biểu đồ cũ (nếu có)
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: getChartColors(chartType, labels.length),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function destroyChart(canvasId) {
    const chart = Chart.getChart(canvasId);
    if (chart) {
        chart.destroy();
    }
}

// --- Các hàm hỗ trợ ---
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatMonth(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}

function getChartColors(chartType, count) {
    const baseColor = 'rgba(75, 192, 192, 0.2)';
    const borderColor = 'rgba(75, 192, 192, 1)';

    if (chartType === 'pie') {
        // Tạo màu ngẫu nhiên cho biểu đồ tròn
        return Array.from({ length: count }, () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`);
    }
    return baseColor;
}

function showErrorMessage(message) {
    alert(message);
}

document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.vertical-navbar').classList.toggle('active');
});
