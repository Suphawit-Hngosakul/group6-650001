document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get("id");
    const studentId = "yourStudentId"; // แทนที่ด้วย studentId ที่เหมาะสม

    console.log("Request ID:", requestId); // Debug URL params

    if (requestId) {
        try {
            const response = await fetch(`http://localhost:8080/api/requests/${requestId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'studentId': studentId // ส่ง studentId ใน headers
                }
            });

            console.log("Response Status:", response.status); // Debug API response

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();  // รับข้อมูลจาก API
            console.log("Data from API:", data); // Debug ข้อมูลที่ได้รับ

            // สร้าง HTML ด้วยข้อมูลที่ได้รับ
            const container = document.getElementById("request-details");
            container.innerHTML = `
                    <main class="infromation">
                        <h2 class="form-title">แบบฟอร์มคำร้องการจดทะเบียนเพิ่ม-ถอนล่าช้า</h2>
                        <h2 class="h10">มหาวิทยาลัยธรรมศาสตร์</h2>
                        <hr>
                        <form id="requestForm" action="#" method="post">
                            <div class="form-row">
                                <label for="date" class="date-label">วันที่</label>
                                <input type="date" id="date" name="date" value="${data.date}" readonly class="date-input">
                            </div>
                            
                            <div class="form-row1">
                                <label for="dean-name" class="dean-label">เรียน ท่านคณบดี</label>
                                <input type="text" id="dean-name" name="dean-name" value="${data.deanName}" readonly class="dean-input">
                                <span>(ผ่านอาจารย์ที่ปรึกษา)</span>
                            </div>
                            
                            <div class="form-row2">
                                <label for="self-name" class="self-name-label">ข้าพเจ้า</label>
                                <input type="text" id="self-name" name="self-name" value="${data.studentName}" readonly class="self-name-input">
                                <label for="student-id" class="student-id-label">เลขทะเบียน</label>
                                <input type="text" id="student-id" name="student-id" value="${data.studentId}" readonly class="student-id-input">
                            </div>
                            
                            <div class="form-row3">
                                <label for="faculty" class="faculty-label">คณะ</label>
                                <input type="text" id="faculty" name="faculty" value="${data.faculty}" readonly class="faculty-input">
                                <label for="year" class="self-year-label">ชั้นปีที่</label>
                                <input type="number" id="year" value="${data.year}" readonly class="self-year-input">
                            </div>
                            
                            <div class="form-row9">
                                <label for="contact-address" class="contact-address-label">ที่อยู่ที่ติดต่อ</label>
                                <input type="text" id="contact-address" value="${data.contactAddress}" readonly class="contact-input">
                            </div>
                            
                            <div class="form-row10">
                                <span>โทรศัพท์มือถือ:</span>
                                <input type="tel" id="phone" value="${data.phone}" readonly class="phone-input">
                                <label id="emailLabel" for="email">E-mail:</label>
                                <input type="email" id="email" value="${data.email}" readonly class="email-input">
                            </div>
                            
                            <div class="request-section">
                                <div class="request-section-title">มีความประสงค์จะ</div>
                                <div class="request-options">
                                            <label>
                                                <input type="checkbox" checked disabled readonly>${data.requests} 
                                            </label>
                                </div>
                            </div>
                            
                            <div class="form-row4">
                                <label for="subject">รหัสวิชา / ชื่อวิชา / Section / (วัน/เวลา) / หน่วยกิต / ชื่อผู้สอน / ลายเซ็นผู้สอน</label>
                                <textarea id="subject" rows="4" readonly>${data.subjectDetails}</textarea>
                            </div>
                            
                            <div class="form-row4">
                                <label for="reason">ชี้แจงเหตุผลเพิ่มเติม</label>
                                <textarea id="reason" rows="4" readonly>${data.reason}</textarea>
                            </div>
                            
                            <div class="form-row11">
                                <span>ขอแสดงความนับถือ</span>
                            </div>
                            
                            <div class="form-row12">
                                <input type="text" class="signature-input" value="${data.signature}" readonly placeholder="ลงชื่อ">
                            </div>
                        </form>
                    </main>
            `;

            // updateTimeline(data.status, data.details); // ตรวจสอบฟังก์ชันนี้ด้วย

        } catch (error) {
            console.error('Error:', error.message);
            console.error('Stack Trace:', error.stack);
            document.getElementById("request-details").innerHTML = "<p>ไม่พบข้อมูลคำร้องที่ต้องการ</p>";
        }
    } else {
        document.getElementById("request-details").innerHTML = "<p>ไม่พบรหัสคำร้องใน URL</p>";
    }
});
