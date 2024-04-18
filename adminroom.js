const token = localStorage.getItem('token');
console.log('Token:', token);
const username = localStorage.getItem('username'); // Giả sử bạn cũng lưu username trong localStorage khi đăng nhập thành công

if (token && username) {
    // Ẩn các mục "Đăng nhập" và "Đăng ký"
    document.getElementById('nav-login').style.display = 'none';
    document.getElementById('nav-register').style.display = 'none';

    // Hiển thị câu chào mừng người dùng
    document.getElementById('nav-welcome').style.display = 'block';
    document.getElementById('username').textContent = username;
}

if (!token) {
    console.error('Token not found!');
} else {
    var headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

document.addEventListener("DOMContentLoaded", () => {
    axios.get('http://localhost:5050/rooms/all', { headers })
        .then((response) => {
            const rooms = response.data;
            displayRooms(rooms);
        })
        .catch((error) => {
            console.error('Có lỗi khi lấy danh sách phòng:', error);
        });
});

function displayRooms(rooms) {
    const roomList = document.getElementById('roomList');
    roomList.innerHTML = '';

    rooms.forEach((room) => {
        const roomItem = document.createElement('li');
        roomItem.classList.add('room-item');

        // Kiểm tra trạng thái của phòng
        if (room.status) {
            roomItem.classList.add('grey-room'); // Thêm lớp CSS nếu trạng thái là true
        }

        roomItem.innerHTML = `
            <div class="room-details">
                <h3>${room.name}</h3>
                <p><strong>Trạng thái:</strong> ${room.status}</p>
                <p><strong>Số chỗ ngồi:</strong> ${room.capacity}</p>
                <div class="seat-selection">
                    <div id="seatList_${room.id}" class="seat-selection"></div>
                </div>
            </div>
            <div class="action-buttons">
                <button type="button" class="btn btn-secondary btn-block mb-2 editRoomBtn" data-room-id="${room.id}">Sửa</button>
                <button type="button" class="btn btn-danger btn-block deleteRoomBtn" data-room-id="${room.id}">Xóa</button>
                <button type="button" class="btn btn-info btn-block mb-2 toggleStatusBtn" data-room-id="${room.id}" data-room-status="${room.status ? 'active' : 'inactive'}">${room.status ? 'Tắt' : 'Bật'}</button>
            </div>
        `;

        roomList.appendChild(roomItem);
        getSeatList(room.id);
    });

    const addRoomButtons = document.querySelectorAll('.addRoomBtn');
    addRoomButtons.forEach((button) => {
        button.addEventListener('click', () => {
            $('#addRoomModal').modal('show');
        });
    });

    const editRoomButtons = document.querySelectorAll('.editRoomBtn');
    editRoomButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const roomId = event.target.getAttribute('data-room-id');
            openEditRoomModal(roomId);
        });
    });

    const deleteRoomButtons = document.querySelectorAll('.deleteRoomBtn');
    deleteRoomButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const roomId = event.target.getAttribute('data-room-id');
            deleteRoom(roomId);
        });
    });

    const toggleStatusButtons = document.querySelectorAll('.toggleStatusBtn');
    toggleStatusButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const roomId = event.target.getAttribute('data-room-id');
            const roomStatus = event.target.getAttribute('data-room-status');
            toggleRoomStatus(roomId, roomStatus === 'active');
        });
    });

}

function toggleRoomStatus(roomId, currentStatus) {
    if (!headers) {
        console.error('Headers not found!');
        return;
    }

    const newStatus = !currentStatus;

    axios.post(`http://localhost:5050/rooms/update-status/${roomId}?status=${newStatus}`, {}, { headers })
        .then((response) => {
            console.log(`Cập nhật trạng thái phòng ${roomId} thành công:`, response.data);
            showMessage('success', `Cập nhật trạng thái phòng ${roomId} thành công`);
            setTimeout(() => {
                window.location.href = 'adminroom.html';
            }, 500);
        })
        .catch((error) => {
            console.error(`Có lỗi khi cập nhật trạng thái phòng ${roomId}:`, error);
            showMessage('danger', `Có lỗi khi cập nhật trạng thái phòng ${roomId}. Vui lòng thử lại sau.`);
        });
}

function getSeatList(roomId) {
    axios.get(`http://localhost:5050/seats/room/${roomId}`)
        .then((response) => {
            const seats = response.data;
            displaySeatList(roomId, seats);
        })
        .catch((error) => {
            console.error(`Có lỗi khi lấy danh sách ghế của phòng ${roomId}:`, error);
        });
}

function displaySeatList(roomId, seats) {
    const seatListContainer = document.getElementById(`seatList_${roomId}`);
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
        seatRow.appendChild(seatElement);
        seatCount++;
    });

    seatList.appendChild(seatRow);
    seatListContainer.appendChild(seatList);
}

function showMessage(type, message) {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('alert');
    messageDiv.classList.add(`alert-${type}`);
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.style.display = 'none';
        messageContainer.removeChild(messageDiv);
    }, 3000);
}

document.getElementById('addRoomForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const roomName = document.getElementById('roomName').value;
    const seatCapacity = document.getElementById('seatCapacity').value;

    if (!headers) {
        console.error('Headers not found!');
        return;
    }

    axios.post('http://localhost:5050/rooms/add', {
        name: roomName,
        capacity: seatCapacity
    }, { headers })
        .then((response) => {
            console.log('Thêm phòng thành công:', response.data);
            showMessage('success', 'Thêm phòng thành công');
            $('#addRoomModal').modal('hide');
            setTimeout(() => {
                window.location.href = 'adminroom.html';
            }, 3000);
        })
        .catch((error) => {
            console.error('Có lỗi khi thêm phòng:', error);
            showMessage('danger', 'Có lỗi khi thêm phòng. Vui lòng thử lại sau.');
        });
});

let currentRoomId = null;

function openEditRoomModal(roomId) {
    axios.get(`http://localhost:5050/rooms/detail/${roomId}`, { headers })
        .then((response) => {9
            const room = response.data;
            currentRoomId = roomId;

            document.getElementById('editRoomName').value = room.name;
            document.getElementById('editSeatCapacity').value = room.capacity;
            console.log('room', roomId);
            $('#editRoomModal').modal('show');
        })
        .catch((error) => {
            console.error(`Có lỗi khi lấy thông tin phòng ${roomId}:`, error);
            showMessage('danger', 'Có lỗi khi lấy thông tin phòng. Vui lòng thử lại sau.');
        });
}

document.getElementById('editRoomForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const roomId = currentRoomId;
    const roomName = document.getElementById('editRoomName').value;
    const seatCapacity = document.getElementById('editSeatCapacity').value;


    if (!headers) {
        console.error('Headers not found!');
        return;
    }

    axios.post(`http://localhost:5050/rooms/update/${roomId}`, {
        name: roomName,
        capacity: seatCapacity,

    }, { headers })
        .then((response) => {
            console.log('Sửa phòng thành công:', response.data);
            showMessage('success', 'Sửa phòng thành công');
            $('#editRoomModal').modal('hide');
            setTimeout(() => {
                window.location.href = 'adminroom.html';
            }, 3000);
        })
        .catch((error) => {
            console.error('Có lỗi khi sửa phòng:', error);
            console.log('id room', roomId)
            showMessage('danger', 'Có lỗi khi sửa phòng. Vui lòng thử lại sau.');
        });
});

function showMessage(type, message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    if (type === 'success') {
        errorMessage.className = 'success-message';
    } else {
        errorMessage.className = 'error-message';
    }
    errorMessage.style.display = 'block';
}

function deleteRoom(roomId) {
    if (confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
        axios.post(`http://localhost:5050/rooms/delete/${roomId}`, {}, { headers })
            .then((response) => {
                console.log('Xóa phòng thành công:', response.data);
                showMessage('success', 'Xóa phòng thành công');
                setTimeout(() => {
                    window.location.href = 'adminroom.html';
                }, 3000);
            })
            .catch((error) => {
                console.error('Có lỗi khi xóa phòng:', error);
                showMessage('danger', 'Có lỗi khi xóa phòng. Vui lòng thử lại sau.');
            });
    }
}
