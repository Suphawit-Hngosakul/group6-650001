function validateForm() {
    // ตรวจสอบว่าอย่างน้อยหนึ่ง checkbox ถูกเลือก
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let isChecked = false;

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            isChecked = true;
        }
    });

    // ถ้าไม่มี checkbox ถูกเลือกให้แจ้งเตือนและไม่ให้ส่งฟอร์ม
    if (!isChecked) {
        alert('กรุณาเลือกช่องหนึ่งช่องก่อนส่งฟอร์ม');
        return false; // หยุดการส่งฟอร์ม
    }

    return true; // ส่งฟอร์ม
}