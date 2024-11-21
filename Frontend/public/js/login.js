// ฟังก์ชันสำหรับส่งข้อมูลล็อกอิน
function submitLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;
    const message = document.getElementById('message');

    // หาก role คือ admin ให้เพิ่ม flag admin
    if (username === 'admin_user' && password === '1234') {
        const userInfo = {
            username: 'ADMIN',
            studentID: 'TEST000000',
            email: 'admin@email.com',
            role: 'ADMIN'
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        window.location.href = 'html/employee/emphome.html';
    }

    //REST API TU
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
        
        if (!data.type) {
            message.innerText = 'The username or password is incorrect.';
            return;
        }
        if (data.type !== role) {
            message.innerText = 'The information is incorrect.';
            return;
        }

        // เก็บข้อมูลผู้ใช้ใน localStorage
        const userInfo = {
            username: data.displayname_en,
            studentID: data.username,
            email: data.email,
            role: data.type
        };

        localStorage.setItem('user', JSON.stringify(userInfo));

        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerText = data.message;

        // ย้ายไปที่หน้าที่เหมาะสม
        if (userInfo.role === 'student') {
            window.location.href = 'home.html';
        } else if (userInfo.role === 'employee') {
            window.location.href = 'employeehome.html';
        }
    })
    .catch(error => {
        message.innerText = 'Error: ' + error.message;
    });
}

// ฟังก์ชันสำหรับตรวจสอบการป้อนข้อมูล
function checkInputs() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;
    const loginBtn = document.getElementById('loginBtn');
    const message = document.getElementById('message');

    // เคลียร์ข้อความข้อผิดพลาด
    message.innerText = '';
    message.style.color = 'red';

    if (!username) {
        message.innerText = 'Username cannot be empty.';
    } else if (!password) {
        message.innerText = 'Password cannot be empty.';
    } else if (!role) {
        message.innerText = 'Please select your role.';
    }

    // เปิด/ปิดปุ่ม login
    loginBtn.disabled = !username || !password || !role;
}

// ฟังก์ชันสำหรับสลับการแสดงรหัสผ่าน
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');

    if (passwordField) {
        const isPasswordHidden = passwordField.getAttribute('type') === 'password';
        passwordField.setAttribute('type', isPasswordHidden ? 'text' : 'password');
        togglePasswordButton.textContent = isPasswordHidden ? ' Hide' : ' Show';
    }
}

// การตั้งค่าเหตุการณ์หลังจาก DOM โหลดแล้ว
document.addEventListener('DOMContentLoaded', () => {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const roleField = document.getElementById('role');
    const togglePasswordButton = document.getElementById('togglePassword');

    if (usernameField) usernameField.addEventListener('input', checkInputs);
    if (passwordField) passwordField.addEventListener('input', checkInputs);
    if (roleField) roleField.addEventListener('change', checkInputs);
    if (togglePasswordButton) togglePasswordButton.addEventListener('click', togglePasswordVisibility);
});
