// REST API
function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const loginBtn = document.getElementById('loginBtn');

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TUe10cbd9ad12a2fbaf42c9db799a8960956ada365c1ec3455320c78e8ab11e0f84249da0030538e747e744ff7cd245e7d'
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.type === undefined) {
            document.getElementById('message').innerText = 'The username or password is incorrect.';
            return;
        }
        if (data.type !== role) {
            document.getElementById('message').innerText = 'The information is incorrect.';
            return;
        }

        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerText = data.message;

        // จัดเก็บข้อมูลผู้ใช้ใน localStorage
        localStorage.setItem('user', JSON.stringify({
            username: data.displayname_en,
            studentID: data.username,
            email: data.email
        }));

        // ย้ายไปที่หน้า index.html
        window.location.href = 'home.html';
    })
    .catch(error => {
        document.getElementById('message').innerText = 'Error: ' + error.message;
    });
}

// =======================================================================================
//Chack
function closedelete() {
    document.getElementById('message').style.color = 'ff0000';
    document.getElementById('Profile').style.display = 'none';
    document.getElementById("loginForm").reset();
    location.reload();
    document.getElementById('message').innerText = '';
}

function checkInputs() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();
    const loginBtn = document.getElementById('loginBtn');

    if (username !== '' && password !== '' && role !== '') {
        loginBtn.disabled = false; // Enable the button if all fields are filled
    } else {
        loginBtn.disabled = true; // Disable the button if any field is empty
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const roleField = document.getElementById('role');

    if (usernameField) usernameField.addEventListener('input', checkInputs);
    if (passwordField) passwordField.addEventListener('input', checkInputs);
    if (roleField) roleField.addEventListener('change', checkInputs);
});

function toggleDropdown() {
    var dropdown = document.getElementById("dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// =======================================================================================
// Close the dropdown if clicked outside
window.onclick = function(event) {
    const dropdown = document.getElementById("dropdown-content");
    if (dropdown && !event.target.matches('.user-info') && !event.target.closest('.user-info')) {
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
};

//logout
function logout() {
    sessionStorage.clear();

    window.location.href = 'index.html';
}

// =======================================================================================
// ฟังก์ชันที่แสดงรายการคำร้องเมื่อคลิกที่ "สัปดาห์ก่อน", "เดือนก่อน", หรือ "ปีก่อน"
function showRequest(timeframe) {
    const requestList = document.getElementById('request-list'); // หาช่องแสดงรายการคำร้อง
    
    // ข้อมูลตัวอย่างคำร้องสำหรับแต่ละช่วงเวลา
    const requests = {
        'week': ['คำร้อง 1', 'คำร้อง 2', 'คำร้อง 3'],  // คำร้องที่ยื่นในสัปดาห์ก่อน
        'month': ['คำร้อง 4', 'คำร้อง 5'],  // คำร้องที่ยื่นในเดือนก่อน
        'year': ['คำร้อง 6', 'คำร้อง 7', 'คำร้อง 8', 'คำร้อง 9']  // คำร้องที่ยื่นในปีก่อน
    };
    
    // เช็คข้อมูลคำร้องที่เกี่ยวข้องกับช่วงเวลาที่คลิก
    const requestItems = requests[timeframe] || []; // หากไม่มีข้อมูลจะใช้ array ว่างๆ
    
    // ตรวจสอบว่ามีคำร้องหรือไม่
    if (requestItems.length > 0) {
        // แสดงหัวข้อสำหรับรายการคำร้องในช่วงเวลานั้น
        requestList.innerHTML = `<h3>คำร้องที่ยื่น ${timeframe === 'week' ? 'สัปดาห์ก่อน' : (timeframe === 'month' ? 'เดือนก่อน' : 'ปีก่อน')}</h3>`;
        // สร้างลิสต์คำร้องและเพิ่มเข้าไปในช่องแสดง
        const listHTML = requestItems.map(item => `<div class="request-item">${item}</div>`).join('');
        requestList.innerHTML += listHTML;
    } else {
        // หากไม่มีคำร้องในช่วงเวลานั้นๆ แสดงข้อความนี้
        requestList.innerHTML = `<p>ไม่มีคำร้องในช่วงเวลานี้</p>`;
    }
}