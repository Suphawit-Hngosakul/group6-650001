// ฟังก์ชันที่แสดงหรือซ่อนป๊อปอัพแจ้งเตือน
function toggleNotification() {
    const popup = document.getElementById('notification-popup');
    console.log('Notification button clicked'); // เพิ่มบรรทัดนี้เพื่อตรวจสอบว่าฟังก์ชันทำงาน
    // ถ้าป๊อปอัพแสดงอยู่ ให้ซ่อน
    if (popup.style.display === 'flex') {
        popup.style.display = 'none';
    } else {
        // ถ้าป๊อปอัพซ่อนอยู่ ให้แสดง
        popup.style.display = 'flex';
    }
}
