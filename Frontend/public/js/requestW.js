document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("requestForm");
    const formTypeInput = document.querySelector("input[name='formType']");
    const dateInput = document.getElementById("date");
    const deanInput = document.getElementById("dean-name");
    const selfNameInput = document.getElementById("self-name");
    const studentIdInput = document.getElementById("student-id");
    const facultyInput = document.getElementById("faculty");
    const yearInput = document.querySelector(".self-year-input");
    const addressInput = document.querySelector(".contact-input");
    const phoneInput = document.querySelector(".phone-input[type='tel']");
    const emailInput = document.querySelector(".email-input");
    const subjectInput = document.getElementById("subject"); // Subject code input
    const reasonInput = document.getElementById("reason"); // Additional reason input
    const checkboxes = document.querySelectorAll(".single-check");
    const submitButton = document.querySelector(".submit-btn");

    // Add event listeners for real-time validation (other inputs)
    deanInput.addEventListener("input", () => validateRequiredField(deanInput, "กรุณากรอกชื่อคณบดี"));
    selfNameInput.addEventListener("input", () => validateNameField());
    studentIdInput.addEventListener("input", () => validateStudentId(studentIdInput));
    facultyInput.addEventListener("input", () => validateFacultyField());
    yearInput.addEventListener("input", () => validateYear(yearInput));
    addressInput.addEventListener("input", () => validateRequiredField(addressInput, "กรุณากรอกที่อยู่ที่ติดต่อ", "address-error"));
    phoneInput.addEventListener("input", () => validatePhoneNumber());
    phoneInput.addEventListener("blur", () => validatePhoneNumber());
    emailInput.addEventListener("input", () => validateTuEmail(emailInput));
    subjectInput.addEventListener("input", () => validateNotEmpty(subjectInput, "กรุณากรอกรหัสวิชาให้ครบถ้วน"));
    reasonInput.addEventListener("input", () => validateNotEmpty(reasonInput, "กรุณากรอกเหตุผลเพิ่มเติม"));

    // Limit checkboxes to only one selection
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                checkboxes.forEach((otherCheckbox) => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });

    // Submit button click event
    submitButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Run all validation checks
        const allValid = validateForm();

        if (allValid) {
            // Collect form data into an object
            const formData = {

                formType: formTypeInput.value,
                date: dateInput.value,
                deanName: deanInput.value,
                selfName: selfNameInput.value,
                studentId: studentIdInput.value,
                faculty: facultyInput.value,
                year: yearInput.value,
                address: addressInput.value,
                phone: phoneInput.value,
                email: emailInput.value,
                subject: subjectInput.value,
                reason: reasonInput.value,
                requests: getCheckedRequests()
            };

            // Get existing data from localStorage or create an empty array
            let storedData = JSON.parse(localStorage.getItem('formW')) || [];

            // Push the new data to the array
            storedData.push(formData);

            // Save the updated array back to localStorage
            localStorage.setItem('formW', JSON.stringify(storedData));

            alert("ส่งสำเร็จ");
            form.reset();
        } else {
            alert("ส่งไม่สำเร็จ โปรดตรวจสอบข้อมูลและจุดประสงค์อีกครั้ง");
        }
    });

    // Function to get the checked request types
    function getCheckedRequests() {
        const checked = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checked.push(checkbox.value);
            }
        });
        return checked;
    }

    // Main validation function
    function validateForm() {
        let valid = true;

        // Skip date validation if it uses a date picker, assuming HTML enforces date selection
        if (!dateInput.value) {
            showError(dateInput, "กรุณาเลือกวันที่", "date-error");
            valid = false;
        } else {
            clearError("date-error");
        }

        // Run individual field validations
        validateRequiredField(deanInput, "กรุณากรอกชื่อคณบดี");
        validateNameField();
        validateStudentId(studentIdInput);
        validateFacultyField();
        validateYear(yearInput);
        validateRequiredField(addressInput, "กรุณากรอกที่อยู่ที่ติดต่อ", "address-error");
        validatePhoneNumber();
        validateTuEmail(emailInput);
        validateNotEmpty(subjectInput, "กรุณากรอกรหัสวิชาให้ครบถ้วน");
        validateNotEmpty(reasonInput, "กรุณากรอกเหตุผลเพิ่มเติม");

        // Check if exactly one checkbox is selected
        if (!validateCheckbox()) {
            showErrorBeforeLabel(emailLabel, "โปรดเลือกจุดประสงค์", "checkbox-error");
            valid = false;
        } else {
            clearError("checkbox-error");
        }

        // Check if any error messages exist
        const errors = document.querySelectorAll(".error-message");
        if (errors.length > 0) {
            valid = false;
        }

        return valid;
    }

    // Function to validate if exactly one checkbox is selected
    function validateCheckbox() {
        const checkedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
        return checkedCheckboxes.length === 1;
    }

    // Validation functions (same as previously provided)
    function validateDate(input) {
        if (!input.value) {
            showError(input, "กรุณาระบุวันที่");
        } else {
            clearError(`${input.id}-error`);
        }
    }

    function validateRequiredField(input, message, errorId = `${input.id}-error`) {
        if (!input.value) {
            showError(input, message, errorId);
        } else {
            clearError(errorId);
        }
    }

    function validateNameField() {
        if (!selfNameInput.value) {
            const studentIdLabel = document.querySelector("label[for='student-id']");
            showErrorBeforeLabel(studentIdLabel, "กรุณากรอกชื่อของคุณ", "name-error");
        } else {
            clearError("name-error");
        }
    }

    function validateStudentId(input) {
        const errorId = "student-id-error";
        if (!input.value || input.value.length !== 10 || isNaN(input.value)) {
            showError(input, "กรุณากรอกเลขทะเบียนให้ครบ 10 หลัก", errorId);
        } else {
            clearError(errorId);
        }
    }

    function validateFacultyField() {
        if (!facultyInput.value) {
            const yearLabel = document.querySelector("label[for='year']");
            showErrorBeforeLabel(yearLabel, "กรุณากรอกชื่อคณะ", "faculty-error");
        } else {
            clearError("faculty-error");
        }
    }

    function validateYear(input) {
        const errorId = "year-error";
        if (!input.value || isNaN(input.value) || input.value < 1 || input.value > 4) {
            showError(input, "กรุณากรอกชั้นปีที่ถูกต้อง (1-4)", errorId);
        } else {
            clearError(errorId);
        }
    }

    function validatePhoneNumber() {
        const phoneValue = phoneInput.value;
        if (phoneValue.length > 0 && phoneValue.length < 10) {
            showErrorBeforeLabel(emailLabel, "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก", "phone-error");
        } else if (phoneValue.length === 10) {
            clearError("phone-error");
        }
    }

    function validateTuEmail(input) {
        const tuEmailRegex = /^[^\s@]+@dome\.tu\.ac\.th$/;
        if (!input.value || !tuEmailRegex.test(input.value)) {
            showError(input, "กรุณากรอกอีเมลที่ถูกต้อง (@dome.tu.ac.th เท่านั้น)", "email-error");
        } else {
            clearError("email-error");
        }
    }

    // New function to check if a field is not empty
    function validateNotEmpty(input, message) {
        const errorId = `${input.id}-error`;
        if (!input.value.trim()) { // Check if the field is empty or just whitespace
            showError(input, message, errorId);
        } else {
            clearError(errorId);
        }
    }

    // Helper functions to show and clear error messages
    function showError(input, message, errorId) {
        if (!document.getElementById(errorId)) {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("error-message");
            errorMessage.id = errorId;
            errorMessage.innerText = message;
            input.insertAdjacentElement("afterend", errorMessage);
        }
    }

    function clearError(errorId) {
        const errorMessage = document.getElementById(errorId);
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function showErrorBeforeLabel(label, message, errorId) {
        if (!document.getElementById(errorId)) {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("error-message");
            errorMessage.id = errorId;
            errorMessage.innerText = message;
            label.insertAdjacentElement("beforebegin", errorMessage);
        }
    }
});
