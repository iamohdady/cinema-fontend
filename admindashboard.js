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
        showErrorMessage('Có lỗi xảy ra khi tải dữ liệu.');
    }
}

document.getElementById('selectedMonth').addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;


    if (!isNaN(month)) { 
        fetchDailyRevenueByMonth(year, month);
        console.log(month, year);
    } else { 
        console.error('Tháng không hợp lệ:', month);
    }
});


async function fetchDailyRevenueByMonth() {
    try {
        const selectedMonth = document.getElementById('selectedMonth').value;
        const [year, month] = selectedMonth.split('-');
        const response = await fetch(`http://localhost:5050/revenue/daily-by-month?year=${year}&month=${month}`);
        const data = await response.json();

        const labels = Object.keys(data);
        const values = Object.values(data);
        renderChart('barChart', 'Doanh thu hàng ngày', labels, values);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu hàng ngày:', error);
        showErrorMessage('Có lỗi xảy ra khi tải doanh thu hàng ngày.');
    }
}

async function fetchMonthlyRevenueByYear(year) {
    try {
        const response = await fetch(`http://localhost:5050/revenue/monthly-by-year?year=${year}`);
        const data = await response.json();

        const labels = Object.keys(data);
        const values = Object.values(data);

        destroyChart('lineChart');
        renderChart('lineChart', 'Doanh thu hàng tháng', labels, values);

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu hàng tháng:', error);
        showErrorMessage('Có lỗi xảy ra khi tải doanh thu hàng tháng.');
    }
}

function destroyChart(canvasId) {
    const chart = Chart.getChart(canvasId);
    if (chart) {
        chart.destroy();
    }
}

function renderChart(canvasId, label, labels, data) {
    destroyChart(canvasId); 
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: 'red',
                borderWidth: 1,
                fill: false
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

function showErrorMessage(message) {
    alert(message);  
}

document.getElementById('selectedDate').addEventListener('change', function () {
    const selectedDate = new Date(this.value); // Lấy giá trị ngày được chọn từ thẻ input
    const year = selectedDate.getFullYear(); // Lấy năm từ ngày được chọn
    const month = selectedDate.getMonth() + 1; // Lấy tháng từ ngày được chọn
    const day = selectedDate.getDate(); // Lấy ngày từ ngày được chọn

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        fetchDailyRevenueByMovieAndDate(year, month, day); // Gọi hàm fetch với các tham số năm, tháng, và ngày đã lấy được
    } else {
        console.error('Ngày không hợp lệ:', day);
    }
});

async function fetchDailyRevenueByMovieAndDate(year, month, day) {
    try {
        const paymentTime = new Date(year, month - 1, day);
        const formattedDate = formatDate(paymentTime); // Định dạng lại ngày theo "dd-mm-yyyy"
        console.log('paymentTime:', formattedDate); // Log giá trị của paymentTime sau khi đã định dạng lại

        const response = await fetch(`http://localhost:5050/revenue/movie-and-date`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentTime: paymentTime
            })
        });
        const data = await response.json();

        const movieNames = data.map(item => item.movieName);
        const revenues = data.map(item => item.totalRevenue);

        renderChartMovie('pieChart', 'bar', 'Doanh thu từng phim', movieNames, revenues); // Tạo biểu đồ cột mới
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu từng phim theo ngày:', error);
        showErrorMessage('Có lỗi xảy ra khi tải doanh thu từng phim theo ngày.');
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Chú ý thêm .toString() và .padStart(2, '0') để đảm bảo tháng có 2 chữ số
    const day = date.getDate().toString().padStart(2, '0'); // Thêm .toString() và .padStart(2, '0') để đảm bảo ngày có 2 chữ số

    return year + '-' + month + '-' + day;
}

function renderChartMovie(canvasId, chartType, label, labels, data) {
    destroyChart(canvasId); 
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: chartType, // Sử dụng loại biểu đồ được truyền vào từ tham số
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Màu nền cho các cột
                borderColor: 'rgba(255, 99, 132, 1)', // Màu đường viền của các cột
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








