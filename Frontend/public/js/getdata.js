document.addEventListener("DOMContentLoaded", function() {
    const requestList = document.getElementById('request-list');

    // ฟังก์ชั่นในการแสดงคำร้องในรูปแบบที่เหมาะสม
    function renderRequest(data) {
        const requestDiv = document.createElement('div');
        requestDiv.classList.add('request-item');
        requestDiv.innerHTML = `
            <a href="html/followReq/followStatus.html?id=${data.id}" class="item-request">
                <div class="box"></div>
                <div class="content">
                    <h3>${data.formType || "คำร้องไม่ระบุประเภท"}</h3>
                    <h4>${data.date || "ไม่ระบุวันที่"}</h4>
                </div>
            </a>
        `;
        requestList.appendChild(requestDiv);
    }

    // ดึง studentId จาก localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const studentId = user ? user.studentID : null;

    // ตรวจสอบว่า studentId มีหรือไม่
    if (!studentId) {
        alert('ไม่พบข้อมูลนักศึกษา');
        return;
    }

    // ใช้ fetch เพื่อดึงข้อมูลคำร้องจาก API โดยส่ง studentId ใน headers
    fetch('http://localhost:8080/api/requests/my-requests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'studentId': studentId // ส่ง studentId ใน headers
        }
    })
    .then(response => response.json())
    .then(data => {
        // ตรวจสอบว่ามีข้อมูลคำร้องหรือไม่
        if (!data || data.length === 0) {
            requestList.innerHTML += "<p>ยังไม่มีข้อมูลคำร้อง</p>";
        } else {
            // ถ้ามีข้อมูลคำร้อง แสดงข้อมูลคำร้องทั้งหมด
            data.forEach((dataItem, index) => {
                const type = dataItem.formType || "คำร้องที่ไม่ระบุ"; // แสดง formType หากมี
                renderRequest(dataItem, index, type);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        requestList.innerHTML += "<p>เกิดข้อผิดพลาดในการดึงข้อมูล</p>";
    });
});
