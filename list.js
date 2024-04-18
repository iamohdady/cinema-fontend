document.addEventListener("DOMContentLoaded", function () {
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
    var selectedSeats = [];
    var selectedShowtimeId = getUrlParameter('showtimeId');
    console.log("showtime lấy", selectedShowtimeId);

    // Gọi API để lấy thông tin chi tiết lịch chiếu và phòng
    axios.get(`http://localhost:5050/showtimes/details/${selectedShowtimeId}`)
        .then(function (response) {
            var scheduleRoomData = response.data;
            displayScheduleAndRoomDetails(scheduleRoomData);
            console.log("Schedule and Room Details: ", scheduleRoomData);
            console.log("showtime", selectedShowtimeId);
            getSeatList(scheduleRoomData.room.id);
            displayRooms([scheduleRoomData.room]); 
        })
        .catch(function (error) {
            console.error('Error fetching schedule and room details:', error);
        });

    // Hàm hiển thị thông tin lịch chiếu và phòng
    function displayScheduleAndRoomDetails(data) {
        var scheduleElement = document.getElementById('scheduleDetails');
        var roomElement = document.getElementById('roomDetails');

        if (scheduleElement && roomElement) {
            scheduleElement.textContent = `Schedule: ${data.schedule.day_time.day_time} ${data.schedule.startTime}`;
            roomElement.textContent = `Room: ${data.room.name}`;
        }
    }

    // Hàm hiển thị thông tin phòng
    function displayRooms(rooms) {
        const roomList = document.getElementById('roomList');
        roomList.innerHTML = '';
    
        rooms.forEach((room) => {
            const roomItem = document.createElement('div');
            roomItem.classList.add('room-item');
            roomItem.innerHTML = `
                <div class="room-details">
                    <h3>${room.name}</h3>
                    <p><strong>Loại phòng:</strong> ${room.rate}</p>
                    <p><strong>Trạng thái:</strong> ${room.status}</p>
                    <p><strong>Số chỗ ngồi:</strong> ${room.capacity}</p>
                    <div id="seatList_${selectedShowtimeId}" class="seat-selection"></div> <!-- Sửa đổi tại đây -->      
                </div>
            `;
            roomList.appendChild(roomItem);
            getSeatList(selectedShowtimeId); // Gọi hàm getSeatList với selectedShowtimeId
        });
    }
    

    // Gọi API để lấy thông tin lịch chiếu của một phim cụ thể
    var seatsContainer = document.querySelector('.seat-map');
    seatsContainer.innerHTML = '';

    function getSeatList(selectedShowtimeId) {
        var selectedShowtimeId = getUrlParameter('showtimeId');

        axios.get(`http://localhost:5050/seats/showtime/${selectedShowtimeId}`)
            .then((response) => {
                const seats = response.data;
                console.log("showtime", selectedShowtimeId);
                displaySeatList(selectedShowtimeId, seats);
            })
            .catch((error) => {
                console.error(`Có lỗi khi lấy danh sách ghế của showtime ${selectedShowtimeId}:`, error);
            });
    }
    
    function displaySeatList(roomId, seats) {
        const seatListContainer = document.getElementById(`seatList_${roomId}`);
        if (seatListContainer) { // Kiểm tra xem phần tử có tồn tại không trước khi thực hiện thao tác
            seatListContainer.innerHTML = '';
    
            const seatList = document.createElement('div');
            seatList.classList.add('seat-map');
    
            let seatCount = 0;
            let seatRow = document.createElement('div');
            seatRow.classList.add('seat-row');
    
            seats.forEach((seat) => {
                if (seatCount === 10) {
                    seatList.appendChild(seatRow);
                    seatRow = document.createElement('div');
                    seatRow.classList.add('seat-row');
                    seatCount = 0;
                }
    
                const seatElement = document.createElement('div');
                seatElement.classList.add('seat');
                seatElement.textContent = seat.name;
                seatElement.dataset.seatId = seat.id; // Set dataset cho seatId
    
                // Kiểm tra xem ghế đã được đặt hay chưa
                if (seat.booked) {
                    seatElement.classList.add('booked-seat');
                    seatElement.title = 'Ghế đã được đặt';
                    seatElement.removeEventListener('click', handleSeatClick);
                } else {
                    // Thêm sự kiện click cho mỗi ghế
                    seatElement.addEventListener('click', function () {
                        handleSeatClick(seatElement, seat.id);
                    });
                }
    
                seatRow.appendChild(seatElement);
                seatCount++;
            });
    
            seatList.appendChild(seatRow);
            seatListContainer.appendChild(seatList);
        } else {
            console.error(`Phần tử seatList_${roomId} không tồn tại trong DOM.`);
        }
    }
    
    // Xử lý sự kiện click trên ghế
    function handleSeatClick(seatElement, seatId) {
        if (seatElement.classList.contains('selected-seat')) {
            // Nếu ghế đã được chọn trước đó, hủy chọn ghế đó
            seatElement.classList.remove('selected-seat');
            selectedSeats = selectedSeats.filter(id => id !== seatId);
        } else {
            // Nếu ghế chưa được chọn trước đó, chọn ghế đó
            seatElement.classList.add('selected-seat');
            selectedSeats.push(seatId);
        }
    }

    // Xử lý sự kiện click nút đặt vé
    var bookTicketButton = document.getElementById('bookTicket');
    bookTicketButton.addEventListener('click', function () {
        var selectedShowtimeId = getUrlParameter('showtimeId'); // Di chuyển đến đây
    
        console.log("Selected Showtime ID:", selectedShowtimeId); // Log selectedShowtimeId ở đây
    
        if (selectedSeats.length === 0 || selectedShowtimeId === null) {
            alert("Vui lòng chọn ghế và lịch chiếu trước khi đặt vé.", selectedShowtimeId);
        } else {
            var requestDataArray = [];
            selectedSeats.forEach(function (seatId) {
                var requestData = {
                    seatId: seatId,
                    showtimeId: selectedShowtimeId
                };
                console.log("Request Data:", requestData); // Log requestData ở đây
                requestDataArray.push(requestData);
            });
    
            if (token) {
                axios.post('http://localhost:5050/tickets/book', requestDataArray, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(function (response) {
                    var firstTicket = response.data[0];
                    var billId = firstTicket.bill_id.id;
                    // Trích xuất thông tin showtimeId, roomId, và danh sách ghế từ phản hồi
                    var roomId = firstTicket.seat_booking_id.showtime_id.room.id;
                    var seats = response.data.map(ticket => ticket.seat_booking_id.seat_id.name).join(', ');
    
                    // Console ra các thông tin này
                    console.log("Đặt vé thành công!");
                    console.log("Showtime ID:", selectedShowtimeId); // Sử dụng selectedShowtimeId ở đây
                    console.log("Room ID:", roomId);
                    console.log("Ghế:", seats);
    
                    alert("Đặt vé thành công. Bill ID: " + billId);
                    window.location.href = `bill.html?billId=${billId}`;

                 })
                .catch(function (error) {
                    console.error('Error booking tickets:', error);
                    alert("Đã xảy ra lỗi khi đặt vé.");
                });
            }
        }
    });
    
    
    
    

    // Hàm lấy tham số từ URL
    function getUrlParameter(name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(window.location.href);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
});