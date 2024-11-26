document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get("id");

    if (!requestId) {
        alert("ไม่พบข้อมูลคำร้อง");
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const studentId = user ? user.studentID : null;

    // ตรวจสอบว่า studentId มีหรือไม่
    if (!studentId) {
        alert('ไม่พบข้อมูลนักศึกษา');
        return;
    }

    // ดึงข้อมูลคำร้องจาก API
    fetch(`http://localhost:8080/api/requests/${requestId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'studentId': studentId // ส่ง studentId ใน headers
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        updateTimeline(data.status, data.details,data.employeename); // เพิ่ม rejectionReason
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลคำร้อง');
    });

    function updateTimeline(status, details, employeename) {
        function setStepActive(stepId, className) {
            const step = document.getElementById(stepId);
            if (step) {
                step.classList.remove('grey');
                step.classList.add(className);
                step.querySelector('.status-text').classList.remove('grey');
                step.querySelector('.status-text').classList.add(className);
            }
        }

        switch (status) {
            case 'Submitted':
                setStepActive('step-submitted', 'green');
                break;
            case 'PENDING':
                setStepActive('step-submitted', 'green');
                setStepActive('step-pending', 'green');
                break;
            case 'ปฏิเสธ':
                document.getElementById('empname').classList.remove('hidden');
                document.getElementById('step-approved').classList.add('hidden');
                document.getElementById('step-rejected').classList.remove('hidden');
                setStepActive('step-submitted', 'green');
                setStepActive('step-pending', 'green');
                setStepActive('step-rejected', 'red');

                // แสดงรายละเอียดคำร้องถูกปฏิเสธ
                const rejectionDetails = document.getElementById('rejection-details');
                if (rejectionDetails) {
                    rejectionDetails.classList.remove('hidden');
                    document.getElementById('rejection-reason').textContent = details || "ไม่มีเหตุผลที่ระบุ";
                    document.getElementById('empname').textContent = "ตรวจสอบโดย" + employeename;
                }
                break;
            case 'ขอข้อมูลเพิ่มเติม':
                document.getElementById('empname').classList.remove('hidden');
                document.getElementById('step-needmore').classList.remove('hidden');
                setStepActive('step-submitted', 'green');
                setStepActive('step-pending', 'green');
                setStepActive('step-needmore', 'orange');
                // แสดงรายละเอียดคำร้องถูกปฏิเสธ
                const needmoreDetails = document.getElementById('rejection-details');
                if (needmoreDetails) {
                    needmoreDetails.classList.remove('hidden');
                    document.getElementById('rejection-reason').textContent = details || "ไม่มีเหตุผลที่ระบุ";
                    document.getElementById('empname').textContent = "ตรวจสอบโดย" + employeename;
                }
                break;
            case 'อนุมัติ':
                document.getElementById('empname').classList.remove('hidden');
                document.getElementById('empname').textContent = "ตรวจสอบโดย: " + employeename;
                setStepActive('step-submitted', 'green');
                setStepActive('step-pending', 'green');
                setStepActive('step-approved', 'green');
                break;
            default:
                console.warn('สถานะคำร้องไม่รองรับ:', status);
        }
    }
});
