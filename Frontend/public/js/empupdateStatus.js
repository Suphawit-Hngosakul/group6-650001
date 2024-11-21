// ฟังก์ชันสำหรับการอัปเดตสถานะคำร้อง
async function updateStatus(status) {
    const requestId = new URLSearchParams(window.location.search).get("id");
    const details = status === "NEED_MORE_INFO" ? prompt("กรุณาระบุข้อมูลเพิ่มเติม:") : "";

    console.log("Sending update for Request ID:", requestId);
    console.log("New Status:", status);
    console.log("Additional Details:", details);

    try {
        const response = await fetch(`http://localhost:8080/api/requests/${requestId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status,
                details: details
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        alert(`สถานะคำร้องถูกเปลี่ยนเป็น: ${status}`);
        console.log("Response from API:", result);

    } catch (error) {
        console.error("Error updating status:", error);
        alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะคำร้อง: " + error.message);
    }
}


// ฟังก์ชันสำหรับการโหลดข้อมูลคำร้องเมื่อหน้าเพจโหลด
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get("id");

    // ตรวจสอบว่ามี requestId หรือไม่
    if (requestId) {
        try {
            // เรียก API เพื่อดึงข้อมูลคำร้อง
            const response = await fetch(`http://localhost:8080/api/requests/${requestId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // ตรวจสอบว่า HTTP request สำเร็จหรือไม่
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // แสดงข้อมูลคำร้องในหน้าเว็บ
            const container = document.getElementById("request-details");
            container.innerHTML = `
                <h2>คำร้องของ ${data.studentName}</h2>
                <p>วันที่: ${data.date}</p>
                <p>คณะ: ${data.faculty}</p>
                <p>ชั้นปีที่: ${data.year}</p>
                <p>สถานะปัจจุบัน: ${data.status}</p>
                <p>เหตุผล: ${data.reason}</p>
            `;

        } catch (error) {
            console.error('Error:', error);
            document.getElementById("request-details").innerHTML = "<p>ไม่พบข้อมูลคำร้องที่ต้องการ</p>";
        }
    } else {
        document.getElementById("request-details").innerHTML = "<p>ไม่พบรหัสคำร้องใน URL</p>";
    }
});
