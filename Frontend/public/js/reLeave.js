function validatePhone() {
    const phoneInput = document.querySelector('.phone-input');
    const phoneError = document.getElementById('phoneError');
    const phonePattern = /^\d{10}$/; // รูปแบบ xxx-xxx-xxxx

    if (!phonePattern.test(phoneInput.value)) {
        phoneError.style.display = 'inline';  // แสดงข้อความข้อผิดพลาด
        phoneInput.classList.add('error');    // เพิ่มคลาส error เพื่อเปลี่ยนสีขอบ
        return false; // คืนค่า false ถ้าไม่ถูกต้อง
    } else {
        phoneError.style.display = 'none';    // ซ่อนข้อความข้อผิดพลาด
        phoneInput.classList.remove('error'); // เอาคลาส error ออก
        return true; // คืนค่า true ถ้าถูกต้อง
    }
}

// ฟังก์ชันตรวจสอบรูปแบบเลขทะเบียน
function validateRegNumber() {
    const regNumberInput = document.querySelector('.student-id-input');
    const regNumberError = document.getElementById('regNumberError');
    const regNumberPattern = /^\d{10}$/; // รูปแบบ xxxxxxxxxx

    if (!regNumberPattern.test(regNumberInput.value)) {
        regNumberError.style.display = 'inline';  // แสดงข้อความข้อผิดพลาด
        regNumberInput.classList.add('error');    // เพิ่มคลาส error เพื่อเปลี่ยนสีขอบ
        return false; // คืนค่า false ถ้าไม่ถูกต้อง
    } else {
        regNumberError.style.display = 'none';    // ซ่อนข้อความข้อผิดพลาด
        regNumberInput.classList.remove('error'); // เอาคลาส error ออก
        return true; // คืนค่า true ถ้าถูกต้อง
    }
}

// เรียกใช้การตรวจสอบเมื่อผู้ใช้พิมพ์ในแต่ละช่อง
document.querySelector('.phone-input').addEventListener('input', validatePhone);
document.querySelector('.student-id-input').addEventListener('input', validateRegNumber);

const option1 = document.getElementById('option-1');
const option2 = document.getElementById('option-2');
const semesterInput1 = document.getElementById('semester-input-1');
const semesterInput2 = document.getElementById('semester-input-2');
const courseCodeInput = document.getElementById('course-code-input');

// ฟังก์ชันที่ใช้ในการควบคุมการกรอกข้อมูล
function toggleInputs() {
    if (option1.checked) {
        semesterInput1.disabled = false;  // เปิดใช้งาน semester-input-1
        semesterInput1.value = '';  // รีเซ็ตค่า
        semesterInput2.disabled = true;  // ปิดการใช้งาน semester-input-2
        semesterInput2.value = '';  // รีเซ็ตค่า
        courseCodeInput.disabled = true;  // ปิดการใช้งาน course-code
        courseCodeInput.value = '';  // รีเซ็ตค่า
    } else if (option2.checked) {
        semesterInput1.disabled = true;  // ปิดการใช้งาน semester-input-1
        semesterInput1.value = '';  // รีเซ็ตค่า
        semesterInput2.disabled = false;  // เปิดใช้งาน semester-input-2
        semesterInput2.value = '';  // รีเซ็ตค่า
        courseCodeInput.disabled = false;  // เปิดใช้งาน course-code
        courseCodeInput.value = '';  // รีเซ็ตค่า
    } else {
        semesterInput1.disabled = true;
        semesterInput2.disabled = true;
        courseCodeInput.disabled = true;
        semesterInput1.value = '';
        semesterInput2.value = '';
        courseCodeInput.value = '';
    }
}

// เรียกฟังก์ชันเมื่อเลือก radio button
option1.addEventListener('change', toggleInputs);
option2.addEventListener('change', toggleInputs);
toggleInputs();

// ตรวจสอบการส่งฟอร์ม
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
    const isPhoneValid = validatePhone();
    const isRegNumberValid = validateRegNumber();

    if (!isPhoneValid || !isRegNumberValid || !form.checkValidity()) {
        event.preventDefault();  // ป้องกันการส่งฟอร์มถ้าไม่ผ่านการตรวจสอบ
        alert('กรุณากรอกข้อมูลให้ครบถ้วนหรือข้อมูลไม่ถูกต้อง');
    }
});