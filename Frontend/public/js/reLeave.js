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