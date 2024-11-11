document.addEventListener("DOMContentLoaded", function() {
    // อ่านข้อมูลจาก localStorage ที่เก็บไว้ใน formW และ formADC
    const formW = JSON.parse(localStorage.getItem('formW')) || [];
    const formADC = JSON.parse(localStorage.getItem('formADC')) || [];

    if (formW.length === 0) {
        document.getElementById('request-list').innerHTML = "<p>ยังไม่มีข้อมูลคำร้อง</p>";
    } else {
        const requestList = document.getElementById('request-list');
        formW.forEach((data, index) => {
            const requestDiv = document.createElement('div');
            requestDiv.classList.add('request-item');
            requestDiv.innerHTML = `
                <a href="html/Follow_item.html?index=${index}" class="item-request">
                    <div class="box"></div>
                    <div class="content">
                        <h3>คำร้องการจดทะเบียนเพิ่ม-ถอนล่าช้า</h3>
                        <h4>${data.date}</h4>
                    </div>
                    
                </a>
            `;
            requestList.appendChild(requestDiv);
        });
    }

    if (formADC.length === 0) {
        document.getElementById('request-list').innerHTML = "<p>ยังไม่มีข้อมูลคำร้อง</p>";
    } else {
        const requestList = document.getElementById('request-list');
        formADC.forEach((data, index) => {
            const requestDiv = document.createElement('div');
            requestDiv.classList.add('request-item');
            requestDiv.innerHTML = `
                <a href="html/Follow_item.html?index=${index}" class="item-request">
                    <div class="box"></div>
                    <div class="content">
                        <h3>คำร้องขอลาพักการศึกษาปริญญาตรี</h3>
                        <h4>${data.date}</h4>
                    </div>
                    
                </a>
            `;
            requestList.appendChild(requestDiv);
        });
    }
});
