// ดึง Element กระดาษทั้งหมดมาเก็บไว้ใน Array
const papers = [
    document.querySelector('#p1'), // แผ่นแรก (ปก + โควต)
    document.querySelector('#p2'), // แผ่นสอง (อวยพร)
    document.querySelector('#p3')  // แผ่นสาม (Spotify)
];
const book = document.querySelector('#flipbook');
const starsContainer = document.querySelector('#shooting-stars-container');

let currentLocation = 0; // ตำแหน่งหน้าปัจจุบัน
let maxLocation = papers.length; 

// ฟังก์ชันสร้างดาวตก
function createShootingStars() {
    starsContainer.style.display = 'block'; // แสดงคอนเทนเนอร์
    starsContainer.innerHTML = ''; // ล้างดาวเก่าทิ้งก่อน
    
    // สร้างดาวตก 15 ดวง สุ่มตำแหน่งและดีเลย์
    for(let i = 0; i < 15; i++) {
        let star = document.createElement('div');
        star.classList.add('shooting-star');
        
        // สุ่มตำแหน่งเริ่มต้นบนแกน X และ Y
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * -50}vh`; // ให้เริ่มจากข้างบนจอนิดนึง
        
        // สุ่มความเร็วและดีเลย์ให้ดูเป็นธรรมชาติ
        star.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// หยุดดาวตกเวลาพลิกหน้ากลับ
function stopShootingStars() {
    starsContainer.style.display = 'none';
}

// เช็คว่าต้องเปิดหรือปิดแอนิเมชันดาวตก
function checkEnding() {
    // ถ้าพลิกมาจนถึงแผ่นสุดท้าย (Spotify)
    if(currentLocation === maxLocation) {
        createShootingStars();
    } else {
        stopShootingStars();
    }
}

// เพิ่ม Event Listener ให้กับกระดาษแต่ละแผ่นเพื่อพลิกไปข้างหน้าหรือข้างหลัง
papers.forEach((paper, index) => {
    paper.addEventListener('click', () => {
        // ถ้าคลิกแผ่นที่ยังไม่ถูกพลิก (เดินหน้า)
        if (!paper.classList.contains('flipped')) {
            paper.classList.add('flipped');
            currentLocation++;
        } 
        // ถ้าคลิกแผ่นที่พลิกไปแล้ว (ถอยหลัง)
        else {
            paper.classList.remove('flipped');
            currentLocation--;
        }

        // สำหรับจอใหญ่ (Responsive): เลื่อนตำแหน่งสมุดให้อยู่ตรงกลางตอนกางออก
        if (currentLocation > 0) {
            book.classList.add('open');
        } else {
            book.classList.remove('open');
        }

        // ตรวจสอบว่าควรเล่นแอนิเมชันดาวตกหรือยัง
        checkEnding();
    });
});

