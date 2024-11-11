document.addEventListener('DOMContentLoaded', function () {
    const togglePasswordButton = document.getElementById('togglePassword');
    if (togglePasswordButton) {
        // ตรวจสอบว่า togglePasswordButton ไม่ใช่ null ก่อนเพิ่ม event listener
        togglePasswordButton.addEventListener('click', function () {
            const passwordField = document.getElementById('password');
            if (passwordField) {
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);

                // เปลี่ยนข้อความและไอคอน
                this.textContent = type === 'password' ? ' Show' : ' Hide';
                this.classList.toggle('show-password');
            } else {
                console.error("ไม่พบ element ที่มี id 'password'");
            }
        });
    } else {
        console.error("ไม่พบปุ่มที่มี id 'togglePassword'");
    }
});