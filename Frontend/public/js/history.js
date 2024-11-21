document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('week-btn').addEventListener('click', () => showRequest('week'));
    document.getElementById('month-btn').addEventListener('click', () => showRequest('month'));
    document.getElementById('year-btn').addEventListener('click', () => showRequest('year'));
});

function showRequest(timeframe) {
    const requestList = document.getElementById('request-list');

    // ฟังก์ชันสำหรับกรองคำร้องตามช่วงเวลา
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
    

    // ฟังก์ชันสำหรับเรียงคำร้องตามวันที่
    function sortRequestsByDate(requests) {
        return requests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // // ฟังก์ชันสำหรับแปลง formType เป็นคำอธิบาย
    // function getFormTypeDescription(formType) {
    //     switch (formType) {
    //         case 'requestW':
    //             return 'คำร้องการจดทะเบียนเพิ่ม-ถอนล่าช้า';
    //         case 'Requestacademicleave':
    //             return 'คำร้องขอลาพักการศึกษาปริญญาตรี';
    //         default:
    //             return 'คำร้องอื่นๆ';
    //     }
    // }

    // ดึง studentId จาก localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const studentId = user ? user.studentID : null;

    // ตรวจสอบว่า studentId มีหรือไม่
    if (!studentId) {
        alert('ไม่พบข้อมูลนักศึกษา');
        return;
    }

    // ดึงข้อมูลคำร้องจาก backend
    fetch('http://localhost:8080/api/requests/my-requests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'studentId': studentId // ส่ง studentId เป็น header
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            return response.json();
        })
        .then(allRequests => {
            // กรองและเรียงข้อมูล
            const filteredRequests = filterRequestsByTimeframe(allRequests, timeframe);
            const sortedRequests = sortRequestsByDate(filteredRequests);

            // แสดงผลข้อมูล
            if (sortedRequests.length > 0) {
                requestList.innerHTML = `<h3>คำร้องที่ยื่น ${timeframe === 'week' ? 'สัปดาห์ก่อน' : (timeframe === 'month' ? 'เดือนก่อน' : 'ปีก่อน')}</h3>`;
                
                const listHTML = sortedRequests.map((request) => `
                    <a href="html/followReq/followForm.html?id=${request.id}" class="request-item">
                        <div class="content">
                            <h3>${request.formType}</h3>
                            <h4>${request.date}</h4>
                        </div>
                    </a>
                `).join('');
                
                requestList.innerHTML += listHTML;
            } else {
                requestList.innerHTML = `<h3>ไม่มีคำร้องในช่วงเวลานี้</h3>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            requestList.innerHTML = `<h3>เกิดข้อผิดพลาดในการดึงข้อมูล</h3>`;
        });
}
