/* ===========================
   🌌 星空背景（全局）- 优化版
=========================== */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random() * 0.5 + 0.3
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawStars);
}
drawStars();


/* ===========================
   🌀 Swiper 初始化 - 添加平滑过渡
=========================== */

// 预加载图片，确保动画流畅
function preloadImages() {
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    // 封面背景图片应该立即显示，不需要设置为0
    if (img.classList.contains("cover-img")) {
      img.style.opacity = "1";
      return;
    }
    
    // 其他图片（回忆页和装饰图片）才需要动画
    if (img.complete) {
      if (!img.classList.contains("cover-decoration")) {
        img.style.opacity = "0";
      }
    } else {
      img.addEventListener("load", function() {
        if (!this.classList.contains("cover-img") && !this.classList.contains("cover-decoration")) {
          this.style.opacity = "0";
        }
      });
    }
  });
}

var swiper = new Swiper(".mySwiper", {
  direction: "vertical",
  mousewheel: {
    sensitivity: 1,
    releaseOnEdges: true
  },
  touchEventsTarget: 'container',  // 让触摸事件优先在容器处理
  speed: 800,
  effect: "slide",
  fadeEffect: {
    crossFade: true
  },
  // 微信适配：允许特定页面的内部滚动不触发翻页
  passiveListeners: true,
  on: {
    slideChange: function() {
      const currentSlide = this.slides[this.activeIndex];
      
      // 重置所有图片的动画状态
      document.querySelectorAll(".photo").forEach((img, index) => {
        const imgSlide = img.closest(".swiper-slide");
        if (imgSlide !== currentSlide) {
          img.style.opacity = "0";
          img.style.transform = "scale(0.9) translateY(30px)";
        }
      });
      
      // 延迟触发当前页面的装饰元素，让过渡更自然
      setTimeout(() => {
        createDecorations(this.activeIndex);
      }, 300);
      
      // 确保当前页面的图片动画触发
      const currentPhoto = currentSlide.querySelector(".photo");
      if (currentPhoto) {
        setTimeout(() => {
          currentPhoto.style.opacity = "1";
          currentPhoto.style.transform = "scale(1) translateY(0)";
        }, 100);
      }
    },
    init: function() {
      preloadImages();
      
      // 初始化时创建第一页的装饰（延迟一点确保DOM已加载）
      setTimeout(() => {
        createDecorations(0);
      }, 100);
      
      // 确保封面页的图片显示
      const coverSlide = this.slides[0];
      if (coverSlide && coverSlide.classList.contains("cover")) {
        const coverImg = coverSlide.querySelector(".cover-img");
        const coverDecoRight = coverSlide.querySelector(".cover-decoration-right");
        const coverDecoLeft = coverSlide.querySelector(".cover-decoration-left");
        if (coverImg) {
          coverImg.style.opacity = "1";
          coverImg.style.transform = "scale(1)";
        }
        if (coverDecoRight) {
          setTimeout(() => {
            coverDecoRight.style.opacity = "1";
            coverDecoRight.style.transform = "scale(1) rotate(0deg)";
          }, 500);
        }
        if (coverDecoLeft) {
          setTimeout(() => {
            coverDecoLeft.style.opacity = "1";
            coverDecoLeft.style.transform = "scale(1) rotate(0deg)";
          }, 700);
        }
      }
      
      // 确保第一页的图片显示（如果是回忆页）
      const firstSlide = this.slides[0];
      const firstPhoto = firstSlide.querySelector(".photo");
      if (firstPhoto) {
        setTimeout(() => {
          firstPhoto.style.opacity = "1";
          firstPhoto.style.transform = "scale(1) translateY(0)";
        }, 500);
      }
    }
  }
});


/* ===========================
   ✨ 装饰组件生成器
=========================== */
function createDecorations(slideIndex) {
  const slides = document.querySelectorAll(".swiper-slide");
  const currentSlide = slides[slideIndex];
  if (!currentSlide) return;
  
  // 清除之前的装饰
  currentSlide.querySelectorAll(".heart, .star, .glow, .particle").forEach(el => el.remove());
  
  // 封面页特殊装饰
  if (currentSlide.classList.contains("cover")) {
    createHearts(currentSlide, 5);
    createGlows(currentSlide, 2);
  }
  
  // 回忆页装饰
  if (currentSlide.classList.contains("memory")) {
    createStars(currentSlide, 8);
    createParticles(currentSlide, 6);
    createGlows(currentSlide, 1);
  }
  
  // 结尾页装饰
  if (currentSlide.classList.contains("end")) {
    createHearts(currentSlide, 10);
    createStars(currentSlide, 12);
  }
}

function createHearts(container, count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 2 + "s";
    heart.style.fontSize = (Math.random() * 15 + 15) + "px";
    container.appendChild(heart);
  }
}

function createStars(container, count) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(star);
  }
}

function createGlows(container, count) {
  for (let i = 0; i < count; i++) {
    const glow = document.createElement("div");
    glow.className = "glow";
    glow.style.left = Math.random() * 100 + "%";
    glow.style.top = Math.random() * 100 + "%";
    glow.style.animationDelay = Math.random() * 4 + "s";
    container.appendChild(glow);
  }
}

function createParticles(container, count) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = "-10px"; // 从顶部开始
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = (Math.random() * 4 + 4) + "s";
    container.appendChild(particle);
  }
}


/* ===========================
   🎆 烟花（只在最后一页启动）- 优化版
=========================== */

const fwCanvas = document.getElementById("fireworks");
const fwCtx = fwCanvas.getContext("2d");

function resizeFireworksCanvas() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFireworksCanvas();
window.addEventListener("resize", resizeFireworksCanvas);

let fireworks = [];
let fireworkInterval = null;

function createFirework() {
  const x = Math.random() * fwCanvas.width;
  const y = Math.random() * (fwCanvas.height * 0.4) + fwCanvas.height * 0.1;
  const colors = [
    [255, 182, 193], // 粉红
    [255, 192, 203], // 浅粉
    [255, 105, 180], // 热粉
    [255, 20, 147],  // 深粉
    [255, 160, 122], // 浅橙
    [255, 218, 185]  // 桃色
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 40; i++) {
    const angle = (Math.PI * 2 * i) / 40;
    fireworks.push({
      x,
      y,
      angle,
      radius: 0,
      speed: Math.random() * 4 + 2,
      alpha: 1,
      color: color
    });
  }
}

function drawFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  fireworks.forEach((p, i) => {
    const vx = Math.cos(p.angle) * p.speed;
    const vy = Math.sin(p.angle) * p.speed;

    p.x += vx;
    p.y += vy;
    p.speed *= 0.97;
    p.alpha -= 0.012;
    p.radius += 0.5;

    fwCtx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    fwCtx.fill();

    if (p.alpha <= 0) fireworks.splice(i, 1);
  });

  requestAnimationFrame(drawFireworks);
}

swiper.on("slideChange", function() {
  const isLastSlide = this.activeIndex === this.slides.length - 1;
  
  if (isLastSlide && !fireworkInterval) {
    fireworkInterval = setInterval(createFirework, 600);
    drawFireworks();
  } else if (!isLastSlide && fireworkInterval) {
    clearInterval(fireworkInterval);
    fireworkInterval = null;
    fireworks = [];
  }
});


/* ===========================
   🎵 点击播放音乐 - 优化版
=========================== */
let musicPlayed = false;
document.body.addEventListener("click", () => {
  if (!musicPlayed) {
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.3; // 降低音量，更柔和
    bgm.play().catch(() => {
      console.log("音乐播放失败，可能需要用户交互");
    });
    musicPlayed = true;
  }
}, { once: true });

// 触摸设备支持
document.body.addEventListener("touchstart", () => {
  if (!musicPlayed) {
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.3;
    bgm.play().catch(() => {});
    musicPlayed = true;
  }
}, { once: true });


/* ===========================
   ✨ 点击光晕特效
=========================== */
function createClickGlow(x, y) {
  const glowsContainer = document.getElementById("clickGlows");
  if (!glowsContainer) return;
  
  const glow = document.createElement("div");
  glow.className = "click-glow";
  glow.style.left = x + "px";
  glow.style.top = y + "px";
  
  glowsContainer.appendChild(glow);
  
  // 动画结束后移除（动画时长0.6s，稍微延迟一点确保动画完成）
  setTimeout(() => {
    if (glow.parentNode) {
      glow.parentNode.removeChild(glow);
    }
  }, 700);
}

// 点击事件
document.addEventListener("click", (e) => {
  createClickGlow(e.clientX, e.clientY);
});

// 触摸事件
document.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  createClickGlow(touch.clientX, touch.clientY);
});


/* ===========================
   📊 统计页面 - 计算在一起的天数
=========================== */
function calculateDaysTogether() {
  // 设置开始日期（可以根据实际情况修改）
  const startDate = new Date('2025-10-12'); // 修改为你们的开始日期
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function animateNumber(element, target, duration = 1000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// 当统计页面激活时，计算并显示天数
/* 地图动画定时器 ID 存储 */
let mapAnimationTimeouts = [];

swiper.on("slideChange", function() {
  const activeSlide = this.slides[this.activeIndex];
  if (activeSlide && activeSlide.classList.contains("stats")) {
    const daysElement = document.getElementById("daysTogether");
    if (daysElement) {
      const days = calculateDaysTogether();
      animateNumber(daysElement, days, 1500);
    }
  }
  
  // 地图页面动画
  if (activeSlide && activeSlide.classList.contains("map")) {
    // 清除之前的所有定时器
    mapAnimationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    mapAnimationTimeouts = [];
    
    const markers = activeSlide.querySelectorAll(".location-marker");
    markers.forEach((marker, index) => {
      // 立即移除active类，准备重新动画
      marker.classList.remove("active");
      
      // 延迟后重新添加active类，从头开始动画显示
      const timeoutId = setTimeout(() => {
        marker.classList.add("active");
      }, index * 1000 + 500); // 每个标记延迟1秒显示，初始延迟500ms
      
      // 保存 timeout ID 供后续清除
      mapAnimationTimeouts.push(timeoutId);
    });
  } else {
    // 离开地图页面时，清除所有定时器并移除active类
    mapAnimationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    mapAnimationTimeouts = [];
    
    document.querySelectorAll(".location-marker").forEach(marker => {
      marker.classList.remove("active");
    });
  }
  
  // 倒计时页面
  if (activeSlide && activeSlide.classList.contains("end")) {
    startCountdown();
  }
});


/* ===========================
   🗺️ 地图动画
=========================== */
function initMapAnimation() {
  // 地图动画在页面切换时触发，已在slideChange中处理
}


/* ===========================
   ⏰ 跨年倒计时
=========================== */
let countdownInterval = null;

function startCountdown() {
  // 清除之前的倒计时
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  // 目标时间：2025年12月31日 24:00:00 (即2026年1月1日 00:00:00)
  const targetDate = new Date('2026-01-01T00:00:00');
  
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
      // 倒计时结束
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新显示，确保两位数
    document.getElementById("days").textContent = String(days).padStart(2, '0');
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
  }
  
  // 立即更新一次
  updateCountdown();
  
  // 每秒更新
  countdownInterval = setInterval(updateCountdown, 1000);
}


/* ===========================
   📅 时间线页面 - 普通页面配置
=========================== */
// 时间线页面现已改为普通页面，支持内部滚动
const timelineSlide = document.querySelector('.timeline');
if (timelineSlide) {
  // 触摸位置记录，用于判断滑动方向
  let touchStartY = 0;
  let isTimelineScrolling = false;
  
  // 防止时间线滚动时触发 Swiper 页面切换（触摸事件）
  timelineSlide.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    // 初始化时假设还有滚动空间
    isTimelineScrolling = true;
  }, { passive: true });
  
  timelineSlide.addEventListener('touchmove', (e) => {
    const isAtTop = timelineSlide.scrollTop <= 0;
    const isAtBottom = timelineSlide.scrollTop + timelineSlide.clientHeight >= timelineSlide.scrollHeight - 1;
    const touchCurrentY = e.touches[0].clientY;
    const isMovingDown = touchCurrentY < touchStartY; // 向下滑（Y减小）
    const isMovingUp = touchCurrentY > touchStartY;   // 向上滑（Y增大）
    
    // 只在明确到达边界且继续滑动同方向时，才阻止传播
    // 这样可以避免微信的"返回上一页"手势误判
    if ((isMovingDown && isAtBottom) || (isMovingUp && isAtTop)) {
      e.stopPropagation();
    }
    // 在内容区域正常滚动时，允许事件冒泡被Swiper的mousewheel处理
  }, { passive: true });
  
  // 鼠标滚轮事件（桌面浏览器）
  timelineSlide.addEventListener('wheel', (e) => {
    const isAtTop = timelineSlide.scrollTop <= 0;
    const isAtBottom = timelineSlide.scrollTop + timelineSlide.clientHeight >= timelineSlide.scrollHeight - 1;
    
    if ((!isAtTop && e.deltaY > 0) || (!isAtBottom && e.deltaY < 0)) {
      e.stopPropagation();
    }
  }, { passive: true });
}
