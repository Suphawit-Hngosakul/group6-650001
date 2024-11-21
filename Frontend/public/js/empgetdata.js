document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("request-table-body");

    // ฟังก์ชั่นโหลดข้อมูลคำร้อง
    function loadRequests(data) {
        tbody.innerHTML = ""; // ล้างข้อมูลเก่าก่อนแสดงผลใหม่

        if (!data || data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='7'>ยังไม่มีข้อมูลคำร้อง</td></tr>";
            return;
        }

        data.forEach(request => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${request.id}</td>
                <td>${request.formType || "ไม่ระบุประเภท"}</td>
                <td>${request.studentId || "ไม่ระบุประเภท"}</td>
                <td>${request.studentName || "ไม่ระบุวันที่"}</td>
                <td>${request.date || "ไม่ระบุวันที่"}</td>
                <td>${request.status}</td>
                <td><a href="empfollowForm.html?id=${request.id}">ตรวจสอบ</a></td>
            `;
            tbody.appendChild(row);
        });
    }

    // ดึง studentId จาก localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const studentId = user ? user.studentID : null;

    if (!studentId) {
        alert('ไม่พบข้อมูลนักศึกษา');
        return;
    }

    // ใช้ fetch เพื่อดึงข้อมูลคำร้อง
    fetch('http://localhost:8080/api/requests/all-requests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => loadRequests(data))
        .catch(error => {
            console.error('Error:', error);
            tbody.innerHTML = "<tr><td colspan='7'>เกิดข้อผิดพลาดในการดึงข้อมูล</td></tr>";
        });
});
