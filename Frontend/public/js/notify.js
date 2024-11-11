function toggleNotification() {
    const popup = document.getElementById('notification-popup');
    const popupMessage = document.getElementById('popup-message');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationButton = document.querySelector('.notification-btn');

    // ตรวจสอบว่า element ไม่ใช่ null ก่อนเข้าถึง
    if (popup) {
        // ดึงข้อมูลจาก localStorage
        let storedData = JSON.parse(localStorage.getItem('formW')) || [];
        
        // ตรวจสอบว่ามีข้อมูลล่าสุดใน localStorage หรือไม่
        if (storedData.length > 0) {
            const latestForm = storedData[storedData.length - 1]; // ดึงข้อมูลคำร้องล่าสุด
            let formType = latestForm.formType;
            const submittedAt = latestForm.submittedAt;

            // เปลี่ยนชื่อฟอร์มให้เป็นมิตรกับผู้ใช้
            if (formType === 'requestW') {
                formType = 'คำร้องจดทะเบียน เพิ่ม - ถอน';
            }

            // อัปเดตข้อความในป๊อปอัพตามข้อมูลล่าสุด
            popupMessage.innerText = `ชื่อฟอร์ม: ${formType}\nเวลาที่ส่ง: ${submittedAt}\nส่งสำเร็จ!`;
        } else {
            // ถ้าไม่มีข้อมูลคำร้อง
            popupMessage.innerText = 'ไม่มีอะไรใหม่';
        }

        // ถ้าป๊อปอัพแสดงอยู่ ให้ซ่อน
        if (popup.style.display === 'flex') {
            popup.style.display = 'none';
        } else {
            // ถ้าป๊อปอัพซ่อนอยู่ ให้แสดง
            popup.style.display = 'flex';

            // ซ่อนสัญลักษณ์แจ้งเตือนหลังจากเปิดดู
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
                localStorage.setItem('notificationStatus', 'viewed');
            }

            // ลบคลาส highlight เพื่อให้ปุ่มกลับสู่สภาพปกติ
            if (notificationButton) {
                notificationButton.classList.remove('highlight');
            }
        }
    } else {
        console.error("ไม่พบ element ที่มี id 'notification-popup'");
    }
}

