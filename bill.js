
document.addEventListener("DOMContentLoaded", function () {
    // Lấy token từ localStorage
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

    // Kiểm tra nếu token tồn tại
    if (token) {
        function fetchBillDetail() {
            // Lấy ID của hóa đơn từ URL
            const urlParams = new URLSearchParams(window.location.search);
            const billId = urlParams.get('billId');
            console.log('Bill ID:', billId); // In ra giá trị của billId để kiểm tra

            if (!billId) {
                console.error('Bill ID is missing in the URL');
                return;
            }

            axios.get(`http://localhost:5050/bill/detail/${billId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Thêm token vào header của yêu cầu
                }
            })

                .then(response => {
                    const data = response.data;
                    const tickets = data.tickets; // Lấy ra mảng tickets từ dữ liệu trả về

                    // Duyệt qua từng vé trong mảng tickets
                    tickets.forEach(ticket => {
                        const showtimeId = ticket.seat_booking_id.showtime_id; // Lấy ra giá trị của showtime_id từ mỗi vé

                        // Bây giờ bạn có thể sử dụng giá trị của showtimeId ở đây
                        console.log('Showtime ID:', showtimeId.id);
                    });

                    const memberInfoContainer = document.getElementById('memberInfo');
                    const ticketInfoContainer = document.getElementById('ticketInfo');

                    // Hiển thị thông tin thành viên
                    const member = data.member_id;
                    memberInfoContainer.innerHTML = `
                    <h4>Thông tin người dùng</h4>
                    <p>Username: ${member.username}</p>
                    <p>Email: ${member.email}</p>
                    <p>Tài khoản: ${member.money}</p>
                    <p>Tổng giá: ${data.total_amount}</p>
                `;

                    // Hiển thị thông tin véQ
                    const firstTicket = data.tickets[0];
                    const movieName = firstTicket.seat_booking_id.showtime_id.movie.name;
                    const startTime = firstTicket.seat_booking_id.showtime_id.schedule.startTime;
                    const roomName = firstTicket.seat_booking_id.showtime_id.room.name;
                    const duration = firstTicket.seat_booking_id.showtime_id.movie.duration;

                    ticketInfoContainer.innerHTML = `
                    <h4>Thông tin vé</h4>
                    <p>Phim: ${movieName}</p>
                    <p>Thời gian bắt đầu: ${startTime}</p>
                    <p>Phòng: ${roomName}</p>
                    <p>Thời Lượng: ${duration} minutes</p>
                    <p>Số Ghế: ${data.tickets.map(ticket => `
                        ${Array.isArray(ticket.seat_booking_id.seat_id.name) ? ticket.seat_booking_id.seat_id.name.join(', ') : ticket.seat_booking_id.seat_id.name}
                    `).join('')}</p>
                `;

                    // Hiển thị thời gian thanh toán và tổng số tiền
                    const paymentTime = document.createElement('p');
                    paymentTime.textContent = `Payment Time: ${data.paymentTime}`;
                    ticketInfoContainer.appendChild(paymentTime);

                    const totalAmountContainer = document.getElementById('totalAmountContainer');
                    const totalAmount = document.getElementById('totalAmount');
                    totalAmount.textContent = `Total Amount: ${data.total_amount}`;
                    totalAmountContainer.appendChild(totalAmount);

                    // Thay đổi ảnh phim
                    const moviePoster = document.querySelector('.ticket-img');
                    moviePoster.src = `./image cinema/${firstTicket.seat_booking_id.showtime_id.movie.image}`;
                })
                .catch(error => console.error('Error:', error));
        }

        fetchBillDetail();
    } else {
        console.error('Token is missing');
    }

    const payButton = document.querySelector('.pay-ticket');
    const paymentMessage = document.getElementById('paymentMessage');

    payButton.addEventListener('click', function () {
        // Lấy id của hóa đơn từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const billId = urlParams.get('billId');
        console.log("bill", billId);

        // Kiểm tra xem billId có tồn tại không
        if (billId) {
            // Gọi API để thanh toán hóa đơn
            axios.post(`http://localhost:5050/member/pay/${billId}`)
                .then(response => {
                    // Xử lý kết quả từ API
                    const message = response.data.message || 'Thanh toán thành công'; // Sử dụng message trả về từ API, hoặc thông báo mặc định
                    displayPaymentMessage(message); // Hiển thị thông báo thanh toán
                    payButton.style.display = 'none';

                    // Hiển thị nút in vé
                    // (Chú ý: Hãy chắc chắn rằng bạn đã bỏ comment phần code in vé ở dưới)
                    const printButtons = document.querySelectorAll('.print-ticket');
                    printButtons.forEach(button => {
                        button.style.display = 'block';
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    displayPaymentMessage('Tài khoản không đủ số dư.'); // Hiển thị thông báo thất bại
                    setTimeout(() => {
                        window.location.href = 'payment.html';
                    }, 2000);
                });
        } else {
            console.error('Bill ID is missing in the URL');
        }
    });

    // Hàm hiển thị thông báo thanh toán
    function displayPaymentMessage(message) {
        paymentMessage.textContent = message;
        paymentMessage.style.display = 'block';
    }



    const printButtons = document.querySelectorAll('.print-ticket');
    printButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Lấy id của hóa đơn từ URL
            const urlParams = new URLSearchParams(window.location.search);
            const billId = urlParams.get('billId');

            // Kiểm tra xem billId có tồn tại không
            if (billId) {
                // Chuyển hướng đến trang in vé với id của hóa đơn
                window.location.href = `ticket.html?billId=${billId}`;
                // window.location.href = `http://localhost:5050/tickets/bill/${billId}`;

            } else {
                console.error('Bill ID is missing in the URL');
            }
        });
    });

    const cancelButton = document.getElementById('cancelTicketButton');
    cancelButton.addEventListener('click', function () {
        // Lấy id của hóa đơn từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const billId = urlParams.get('billId');

        console.log('token', token);
        // Kiểm tra xem billId có tồn tại không
        if (billId) {
            // Gọi API để hủy hóa đơn
            axios.post(`http://localhost:5050/bill/cancel/${billId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    // Xử lý kết quả từ API
                    const message = response.data.message || 'Hủy hóa đơn thành công'; // Sử dụng message trả về từ API, hoặc thông báo mặc định
                    displayPaymentMessage(message);

                    // Ẩn nút "Thanh Toán" và "In vé" sau khi hủy hóa đơn thành công
                    document.querySelector('.pay-ticket').style.display = 'none';
                    document.querySelectorAll('.print-ticket').forEach(button => {
                        button.style.display = 'none';
                    });

                    // Đặt hẹn giờ để chuyển hướng sang trang mới sau 2 giây
                    setTimeout(() => {
                        window.location.href = `home.html`;
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    displayPaymentMessage('Hủy hóa đơn thất bại.');

                });
        } else {
            console.error('Bill ID is missing in the URL');
        }
    });

});
