// ดึง Element กระดาษทั้งหมดมาเก็บเรียงตามลำดับจากบนลงล่าง
const papers = [
    document.querySelector('#p1'),     // ปก (index 0)
    document.querySelector('#p2'),     // อวยพร 1 (index 1)
    document.querySelector('#p2-half'), // อวยพร 2 (index 2)
    document.querySelector('#p3')      // Spotify (index 3)
];
const book = document.querySelector('#flipbook');
const starsContainer = document.querySelector('#shooting-stars-container');

let currentLocation = 0; // ตำแหน่งหน้าปัจจุบัน
let maxLocation = papers.length; 

function createShootingStars() {
    starsContainer.style.display = 'block'; 
    starsContainer.innerHTML = ''; 
    
    for(let i = 0; i < 15; i++) {
        let star = document.createElement('div');
        star.classList.add('shooting-star');
        
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * -50}vh`; 
        
        star.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

function stopShootingStars() {
    starsContainer.style.display = 'none';
}

function checkEnding() {
    // -- ปรับปรุง --
    // ตรวจสอบเมื่อเปิดครบทุกแผ่น
    if(currentLocation === maxLocation) { 
        createShootingStars();
    } else {
        stopShootingStars();
    }
}

// ลูปตั้งค่า Z-index และ Event Listener ให้กระดาษแต่ละแผ่น
papers.forEach((paper, index) => {
    // ให้ JS เป็นตัวตั้งค่า z-index เริ่มต้นให้เลย (ปกอยู่บนสุดเสมอ)
    paper.style.zIndex = maxLocation - index;

    paper.addEventListener('click', () => {
        if (!paper.classList.contains('flipped')) {
            // เปิดหน้าไปข้างหน้า
            paper.classList.add('flipped');
            
            // ลด z-index ลงเมื่อพลิกไปกองฝั่งซ้าย (ดีเลย์ 500ms ให้สลับกลางอากาศ)
            setTimeout(() => {
                paper.style.zIndex = index + 1;
            }, 500);
            
            currentLocation++;
        } 
        else {
            // พลิกหน้ากลับหลัง
            paper.classList.remove('flipped');
            
            // คืนค่า z-index ให้กลับมาอยู่ด้านบนเหมือนเดิมเมื่อพลิกกลับขวา
            setTimeout(() => {
                paper.style.zIndex = maxLocation - index;
            }, 500);
            
            currentLocation--;
        }

        // -- ปรับปรุงการจัดวางหนังสือ --
        // เช็คตำแหน่งเพื่อจัดสมุดให้สมดุล
        if (currentLocation === maxLocation) {
            // เปิดจนสุดแล้ว ให้ปิดด้านหลัง
            book.classList.remove('open');
            book.classList.add('closed-last');
        } else if (currentLocation > 0) {
            // เปิดอยู่ตรงกลาง ให้กางออก
            book.classList.remove('closed-last');
            book.classList.add('open');
        } else {
            // ปิดด้านหน้า
            book.classList.remove('open');
            book.classList.remove('closed-last');
        }

        checkEnding();
    })
});
// --- ระบบ Swipe สำหรับมือถือ (ปัดซ้าย-ขวาเพื่อเปิดสมุด) ---
let touchStartX = 0;
let touchEndX = 0;

// ตรวจจับตำแหน่งนิ้วตอนเริ่มแตะหน้าจอ
book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

// ตรวจจับตำแหน่งนิ้วตอนปล่อยจากหน้าจอ
book.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

// ฟังก์ชันคำนวณการปัดนิ้ว
function handleSwipe() {
    const swipeThreshold = 50; // ระยะขั้นต่ำในการปัด (ตั้งไว้ที่ 50 px เพื่อไม่ให้เซนซิทีฟเกินไป)

    // ปัดนิ้วไปทางซ้าย (Swipe Left) -> เปิดหน้าต่อไป
    if (touchStartX - touchEndX > swipeThreshold) {
        if (currentLocation < maxLocation) {
            // สั่งจำลองการคลิกกระดาษแผ่นที่กำลังจะเปิด
            papers[currentLocation].click(); 
        }
    }
    // ปัดนิ้วไปทางขวา (Swipe Right) -> ย้อนกลับไปหน้าก่อนหน้า
    else if (touchEndX - touchStartX > swipeThreshold) {
        if (currentLocation > 0) {
            // สั่งจำลองการคลิกกระดาษแผ่นที่เปิดไปแล้วให้กลับมา
            papers[currentLocation - 1].click(); 
        }
    }
}