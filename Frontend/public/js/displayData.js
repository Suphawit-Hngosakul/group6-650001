document.addEventListener("DOMContentLoaded", function() {
    // อ่านข้อมูลจาก localStorage ที่เก็บไว้ใน formW และ formADC
    const formW = JSON.parse(localStorage.getItem('formW')) || [];
    const formADC = JSON.parse(localStorage.getItem('formADC')) || [];
    const formType = JSON.parse(localStorage.getItem('formType')) || [];

    const requestList = document.getElementById('request-list');

    // ฟังก์ชั่นในการแสดงคำร้องในรูปแบบที่เหมาะสม
    function renderRequest(data, index, type) {
        const requestDiv = document.createElement('div');
        requestDiv.classList.add('request-item');
        requestDiv.innerHTML = `
            <a href="html/Follow_item.html?index=${index}" class="item-request">
                <div class="box"></div>
                <div class="content">
                    <h3>${type}</h3>
                    <h4>${data.date}</h4>
                </div>
            </a>
        `;
        requestList.appendChild(requestDiv);
    }

    // แสดงคำร้องจาก formW
    if (formW.length === 0) {
        requestList.innerHTML += "<p>ยังไม่มีข้อมูลคำร้อง</p>";
    } else {
        formW.forEach((data, index) => {
            const type = formType[index] || "คำร้องการจดทะเบียนเพิ่ม-ถอนล่าช้า"; // ใช้ formType ที่จัดเก็บไว้
            renderRequest(data, index, type);
        });
    }

    // แสดงคำร้องจาก formADC
    if (formADC.length === 0) {
        requestList.innerHTML += "<p>ยังไม่มีข้อมูลคำร้อง</p>";
    } else {
        formADC.forEach((data, index) => {
            const type = formType[index + formW.length] || "คำร้องขอลาพักการศึกษาปริญญาตรี"; // เพิ่มค่า index จาก formW เพื่อไม่ให้ชนกับ formADC
            renderRequest(data, index + formW.length, type);
        });
    }
});
