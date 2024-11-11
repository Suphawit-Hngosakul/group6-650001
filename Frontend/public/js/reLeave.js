function validatePhone() {
    const phoneInput = document.querySelector('.phone-input');
    const phoneError = document.getElementById('phoneError');
    const phonePattern = /^\d{10}$/;

    if (!phonePattern.test(phoneInput.value)) {
        phoneError.style.display = 'inline';
        phoneInput.classList.add('error');
        return false;
    } else {
        phoneError.style.display = 'none';
        phoneInput.classList.remove('error');
        return true;
    }
}

function validateRegNumber() {
    const regNumberInput = document.querySelector('.student-id-input');
    const regNumberError = document.getElementById('regNumberError');
    const regNumberPattern = /^\d{10}$/;

    if (!regNumberPattern.test(regNumberInput.value)) {
        regNumberError.style.display = 'inline';
        regNumberInput.classList.add('error');
        return false;
    } else {
        regNumberError.style.display = 'none';
        regNumberInput.classList.remove('error');
        return true;
    }
}

document.querySelector('.phone-input').addEventListener('input', validatePhone);
document.querySelector('.student-id-input').addEventListener('input', validateRegNumber);

const option1 = document.getElementById('option-1');
const option2 = document.getElementById('option-2');
const semesterInput1 = document.getElementById('semester-input-1');
const semesterInput2 = document.getElementById('semester-input-2');
const courseCodeInput = document.getElementById('course-code-input');

function toggleInputs() {
    if (option1.checked) {
        semesterInput1.disabled = false;
        semesterInput2.disabled = true;
        courseCodeInput.disabled = true;
        semesterInput2.value = '';
        courseCodeInput.value = '';
    } else if (option2.checked) {
        semesterInput1.disabled = true;
        semesterInput2.disabled = false;
        courseCodeInput.disabled = false;
        semesterInput1.value = '';
    }
}

option1.addEventListener('change', toggleInputs);
option2.addEventListener('change', toggleInputs);
toggleInputs();

const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
    const isPhoneValid = validatePhone();
    const isRegNumberValid = validateRegNumber();

    if (!isPhoneValid || !isRegNumberValid || !form.checkValidity()) {
        event.preventDefault();
        alert('ส่งไม่สำเร็จ โปรดตรวจสอบข้อมูลและจุดประสงค์อีกครั้ง');
    } else {
        event.preventDefault();
        saveFormData();
        alert('ส่งสำเร็จ');
        form.reset();
    }
});

function saveFormData() {
    // Collect form data
    const formData = {
        date: document.getElementById('date').value,
        deanName: document.getElementById('dean-name').value,
        selfName: document.getElementById('self-name').value,
        studentID: document.getElementById('student-id').value,
        educationStatus: document.querySelector('input[name="education-status"]:checked').value,
        advisorName: document.getElementById('advisor-name').value,
        reason: document.getElementById('reason').value,
        term: document.getElementById('term').value,
        totalTerms: document.getElementById('totalTerms').value,
        registerOption: document.querySelector('input[name="register-option"]:checked').id,
        semesterInput1: document.getElementById('semester-input-1').value,
        semesterInput2: document.getElementById('semester-input-2').value,
        courseCode: document.getElementById('course-code-input').value,
        contact: document.querySelector('.contact-input').value,
        phone: document.getElementById('phone').value,
        signature: document.querySelector('.signature-input').value
    };

    // Retrieve existing data from localStorage (or initialize as an empty array)
    let formADC = JSON.parse(localStorage.getItem('formADC')) || [];

    // Append the new form data to the existing array
    formADC.push(formData);

    // Save the updated array back to localStorage
    localStorage.setItem('formADC', JSON.stringify(formADC));
}
