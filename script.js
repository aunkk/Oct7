/* --- JS ทั้งหมด: วางทับไฟล์ script.js เดิมได้เลย --- */

// ดึง Element กระดาษทั้งหมดมาเก็บเรียงตามลำดับจากบนลงล่าง
const papers = [
    document.querySelector('#p1'),     // ปก (index 0)
    document.querySelector('#p2'),     // อวยพร 1 (index 1)
    document.querySelector('#p2-half'), // อวยพร 2 (index 2)
    document.querySelector('#p3')      // Spotify/ปกหลัง (index 3)
];
const book = document.querySelector('#flipbook');
const starsContainer = document.querySelector('#shooting-stars-container');
const concludeText = document.querySelector('.final-conclude-text'); // ดึงข้อความสุดท้ายมาเก็บไว้

let currentLocation = 0; // ตำแหน่งหน้าปัจจุบัน
let maxLocation = papers.length; 
let isFlipping = false; // ตัวแปรบล็อคการกด/ปัดรัวๆ

// ฟังก์ชันสร้างดาวตก
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

// หยุดดาวตก
function stopShootingStars() {
    starsContainer.style.display = 'none';
}

// ดึง Element ของ Overlay อันใหม่มาเก็บไว้ (เพิ่มตรงด้านบนของไฟล์)
const finalQuoteOverlay = document.querySelector('#final-quote-overlay'); 

// ... ฟังก์ชันสร้างดาวตกเหมือนเดิม ...

function checkEnding() {
    // ตรวจสอบเมื่อเปิดครบทุกแผ่น
    if(currentLocation === maxLocation) { 
        createShootingStars();
        // ✅ ถึงหน้าจบ: สั่งให้ข้อความสุดท้ายกลางจอปรากฏขึ้น (เพิ่มคลาส show)
        finalQuoteOverlay.classList.add('show'); 
    } else {
        stopShootingStars();
        // ❌ พลิกกลับ: ซ่อนข้อความ (ลบคลาส show)
        finalQuoteOverlay.classList.remove('show'); 
    }
}
// ลูปตั้งค่า Z-index และ Event Listener ให้กระดาษแต่ละแผ่น
papers.forEach((paper, index) => {
    // ให้ JS เป็นตัวตั้งค่า z-index เริ่มต้นให้เลย (ปกอยู่บนสุดเสมอ)
    paper.style.zIndex = maxLocation - index;

    paper.addEventListener('click', () => {
        // ถ้าระบบกำลังพลิกหน้าอยู่ ให้บล็อคการกดซ้ำ (เพื่อป้องกันบัค)
        if (isFlipping) return; 
        isFlipping = true; // ล็อคระบบ

        if (!paper.classList.contains('flipped')) {
            // เปิดหน้าไปข้างหน้า
            paper.classList.add('flipped');
            
            setTimeout(() => {
                paper.style.zIndex = index + 1;
            }, 500);
            
            currentLocation++;
        } 
        else {
            // พลิกหน้ากลับหลัง
            paper.classList.remove('flipped');
            
            setTimeout(() => {
                paper.style.zIndex = maxLocation - index;
            }, 500);
            
            currentLocation--;
        }

        // จัดสมุดให้สมดุล (แก้บัคตกขอบจอในมือถือ)
        if (currentLocation === maxLocation) {
            book.classList.remove('open');
            book.classList.add('closed-last');
        } else if (currentLocation > 0) {
            book.classList.remove('closed-last');
            book.classList.add('open');
        } else {
            book.classList.remove('open');
            book.classList.remove('closed-last');
        }

        checkEnding();

        // ปลดล็อคระบบเมื่อกระดาษพลิกเสร็จ (ดีเลย์ 800ms)
        setTimeout(() => {
            isFlipping = false;
        }, 800);
    });
});

// --- ระบบ Swipe สำหรับมือถือ (ปัดซ้าย-ขวาเพื่อเปิดสมุด) ---
let touchStartX = 0;
let touchEndX = 0;

book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

book.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    // ถ้าระบบกำลังพลิกหน้าอยู่ ห้ามปัดซ้ำ
    if (isFlipping) return; 

    const swipeThreshold = 50; // ระยะขั้นต่ำในการปัด

    // ปัดซ้าย (Swipe Left) -> เปิดหน้าต่อไป
    if (touchStartX - touchEndX > swipeThreshold) {
        if (currentLocation < maxLocation) {
            papers[currentLocation].click(); 
        }
    }
    // ปัดขวา (Swipe Right) -> ย้อนกลับไปหน้าก่อนหน้า
    else if (touchEndX - touchStartX > swipeThreshold) {
        if (currentLocation > 0) {
            papers[currentLocation - 1].click(); 
        }
    }
}