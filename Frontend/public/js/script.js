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

        if (data.type === 'employee') {
            window.location.href = 'employeehome.html';
        }else {
            // ย้ายไปที่หน้า index.html
            window.location.href = 'home.html';
        }
        
    })
    .catch(error => {
        document.getElementById('message').innerText = 'Error: ' + error.message;
    });
}

// =======================================================================================
//Chack
function closedelete() {
    document.getElementById('message').style.color = 'ff0000';
    document.getElementById("loginForm").reset();
    location.reload();
    document.getElementById('message').innerText = '';
}

function checkInputs() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();
    const loginBtn = document.getElementById('loginBtn');
    const message = document.getElementById('message');

    // เคลียร์ข้อความข้อผิดพลาด
    message.innerText = '';
    message.style.color = 'red';

    if (username === '') {
        message.innerText = 'Username cannot be empty.';
    } else if (password === '') {
        message.innerText = 'Password cannot be empty.';
    } else if (role === '') {
        message.innerText = 'Please select your role.';
    } else {
        message.innerText = ''; // เคลียร์ข้อความข้อผิดพลาดหากกรอกครบทุกฟิลด์
    }

    // เปิด/ปิดปุ่ม login ตามความครบถ้วนของข้อมูล
    loginBtn.disabled = username === '' || password === '' || role === '';
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
    localStorage.clear();

    window.location.href = 'index.html';
}

function showRequest(timeframe) {
    const requestList = document.getElementById('request-list');
    
    const formW = JSON.parse(localStorage.getItem('formW')) || [];
    const formADC = JSON.parse(localStorage.getItem('formADC')) || [];
    const allRequests = [...formW, ...formADC];

    function filterRequestsByTimeframe(requests, timeframe) {
        const now = new Date();
        let filteredRequests = [];

        requests.forEach(request => {
            const requestDate = new Date(request.date);
            const diffTime = now - requestDate;

            switch (timeframe) {
                case 'week':
                    if (diffTime <= 7 * 24 * 60 * 60 * 1000) {
                        filteredRequests.push(request);
                    }
                    break;
                case 'month':
                    if (diffTime > 7 * 24 * 60 * 60 * 1000 && diffTime <= 30 * 24 * 60 * 60 * 1000) {
                        filteredRequests.push(request);
                    }
                    break;
                case 'year':
                    if (diffTime > 30 * 24 * 60 * 60 * 1000 && diffTime <= 365 * 24 * 60 * 60 * 1000) {
                        filteredRequests.push(request);
                    }
                    break;
            }
        });

        return filteredRequests;
    }

    function sortRequestsByDate(requests) {
        return requests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function getFormTypeDescription(formType) {
        switch (formType) {
            case 'requestW':
                return 'คำร้องการจดทะเบียนเพิ่ม-ถอนล่าช้า';
            case 'Requestacademicleave':
                return 'คำร้องขอลาพักการศึกษาปริญญาตรี';
            default:
                return 'คำร้องอื่นๆ';
        }
    }

    const filteredRequests = filterRequestsByTimeframe(allRequests, timeframe);
    const sortedRequests = sortRequestsByDate(filteredRequests);

    if (sortedRequests.length > 0) {
        requestList.innerHTML = `<h3>คำร้องที่ยื่น ${timeframe === 'week' ? 'สัปดาห์ก่อน' : (timeframe === 'month' ? 'เดือนก่อน' : 'ปีก่อน')}</h3>`;
        const sortedIndices = sortedRequests.map(request => allRequests.indexOf(request));
        localStorage.setItem('sortedIndices', JSON.stringify(sortedIndices));

        const listHTML = sortedRequests.map((request, index) => `
            <a href="html/Follow_item.html?index=${index}" class="request-item">
                <div class="content">
                    <h3>${getFormTypeDescription(request.formType)}</h3>
                    <h4>${request.date}</h4>
                </div>
            </a>
        `).join('');



        requestList.innerHTML += listHTML;
    } else {
        requestList.innerHTML = `<h3>ไม่มีคำร้องในช่วงเวลานี้</h3>`;
    }
}

